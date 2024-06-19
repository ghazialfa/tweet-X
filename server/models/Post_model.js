const { ObjectId } = require("mongodb");
const database = require("../config/mongodb");
const redis = require("../helpers/redis");

class Post {
  static postCollection() {
    return database.collection("Posts");
  }

  //* ─── Create Post ─────────────────────────────────────────────────────
  static async createPost(postData) {
    const result = await this.postCollection().insertOne(postData);

    redis.del("posts:all");
    const post = await this.postCollection()
      .aggregate([
        {
          $lookup: {
            from: "User",
            localField: "authorId",
            foreignField: "_id",
            as: "Author",
          },
        },
        {
          $unwind: {
            path: "$Author",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $sort: { createdAt: -1 },
        },
      ])
      .toArray();
    redis.set("posts:all", JSON.stringify(post));

    return result;
  }

  //* ─── Get All Posts ───────────────────────────────────────────────────
  static async getPosts() {
    const postCache = await redis.get("posts:all");

    if (postCache) {
      return JSON.parse(postCache);
    }

    const agg = [
      {
        $lookup: {
          from: "User",
          localField: "authorId",
          foreignField: "_id",
          as: "Author",
        },
      },
      {
        $unwind: {
          path: "$Author",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ];

    const cursor = this.postCollection().aggregate(agg);
    const posts = await cursor.toArray();
    redis.set("posts:all", JSON.stringify(posts));
    return posts;
  }

  //* ─── Get Post By Id ───────────────────────────────────────────────────
  static async getPostById(_id) {
    // return await this.postCollection().findOne({ _id: new ObjectId(_id) });
    const agg = [
      {
        $match: {
          _id: new ObjectId(_id),
        },
      },
      {
        $lookup: {
          from: "User",
          localField: "authorId",
          foreignField: "_id",
          as: "Author",
        },
      },
      {
        $unwind: {
          path: "$Author",
          preserveNullAndEmptyArrays: true,
        },
      },
    ];

    const cursor = this.postCollection().aggregate(agg);
    const result = await cursor.toArray();
    return result[0];
  }

  //* ─── Add Comment ───────────────────────────────────────────────────
  static async addComment(postId, commentData) {
    const result = await this.postCollection().updateOne(
      { _id: new ObjectId(postId) },
      { $push: { comments: commentData } }
    );
    // console.log("🚀 ~ Post ~ addComment ~ result:", result);
    // return { message: "Success to comment the post" };
    redis.del("posts:all");
    return result;
  }

  //* ─── Add Like ─────────────────────────────────────────────────────
  static async addLike(postId, likeData) {
    // console.log("🚀 ~ Post ~ addLike ~ likeData:", likeData);
    const result = await this.postCollection().updateOne(
      { _id: new ObjectId(postId) },
      { $push: { likes: likeData } }
    );

    redis.del("posts:all");
    return result;
  }
}

module.exports = Post;
