const { ObjectId } = require("mongodb");
const database = require("../config/mongodb");

class Follow {
  //! ─── Follow ──────────────────────────────────────────────────────────
  static followCollection() {
    return database.collection("Follow");
  }

  //* ─── Add Follow ──────────────────────────────────────────────
  static async addFollow(followData) {
    const result = await this.followCollection().insertOne(followData);
    const insertedId = result.insertedId;
    return await this.followCollection().findOne({ _id: insertedId });
  }

  //* ─── Remove Follow ───────────────────────────────────────────────────
  static async removeFollow(followData) {
    const result = await this.followCollection().deleteOne(followData);
    return result;
  }

  //* ─── Get Following ────────────────────────────────────────────────
  static async getFollowing(userId) {
    // console.log("🚀 ~ Follow ~ getFollowing ~ userId:", userId);
    const agg = [
      {
        $match: {
          followerId: new ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "User",
          localField: "followerId",
          foreignField: "_id",
          as: "FollowerData",
        },
      },
      {
        $lookup: {
          from: "User",
          localField: "followingId",
          foreignField: "_id",
          as: "FollowingData",
        },
      },
    ];

    const cursor = this.followCollection().aggregate(agg);
    const result = await cursor.toArray();
    // console.log("🚀 ~ Follow ~ getFollowing ~ result:", result);
    const followingData = result.map((el) => el.FollowingData[0]);
    // console.log("🚀 ~ Follow ~ getFollowing ~ followingData:", followingData);
    const newResult = {
      ...result[0],
      FollowingData: followingData,
      FollowerData: result[0].FollowerData,
    };
    // console.log("🚀 ~ Follow ~ getFollowing ~ newResult:", newResult);
    return newResult;
  }

  //* ─── Get Followers ────────────────────────────────────────────────
  static async getFollowers(userId) {
    // console.log("🚀 ~ Follow ~ getFollowers ~ userId:", userId);
    const agg = [
      {
        $match: {
          followingId: new ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "User",
          localField: "followingId",
          foreignField: "_id",
          as: "FollowingData",
        },
      },
      {
        $lookup: {
          from: "User",
          localField: "followerId",
          foreignField: "_id",
          as: "FollowerData",
        },
      },
    ];

    const cursor = this.followCollection().aggregate(agg);
    const result = await cursor.toArray();
    // console.log("🚀 ~ Follow ~ getFollowers ~ result:", result);
    const followerData = result.map((el) => el.FollowerData[0]);
    // console.log("🚀 ~ Follow ~ getFollowing ~ followerData:", followerData);
    const newResult = {
      ...result[0],
      FollowerData: followerData,
      FollowingData: result[0].FollowingData,
    };
    // console.log("🚀 ~ Follow ~ getFollowing ~ newResult:", newResult);
    return newResult;
  }

  //* ─── Get Data Follow Is True ─────────────────────────────────────────
  static async checkFollow(userId, followedId) {
    // console.log("🚀 ~ Follow ~ checkFollow ~ followedId:", followedId);
    // console.log("🚀 ~ Follow ~ getDataFollowIsTrue ~ userId:", userId);
    const agg = [
      {
        $match: {
          followerId: new ObjectId(userId),
          followingId: new ObjectId(followedId),
        },
      },
    ];

    const cursor = this.followCollection().aggregate(agg);
    const result = await cursor.toArray();
    // console.log("🚀 ~ Follow ~ checkFollow ~ result:", result);
    return result[0];
  }
}

module.exports = Follow;
