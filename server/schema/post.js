const { ObjectId } = require("mongodb");
const Post = require("../models/Post_model");

const postTypeDefs = `#graphql

  type Post {
    _id: ID
    content: String!
    tags: [String]
    authorId: ID!
    comments: [Comments]
    likes: [Likes]
    imgUrl: String
    createdAt: String
    updatedAt: String
    Author: Author
  }

  type Author {
    _id: ID
    name: String
    username: String
    email: String
  }

  type Comments {
    content: String
    username: String
    createdAt: String
    updatedAt: String
  }

  type Likes {
    username: String
    createdAt: String
    updatedAt: String
  }

  type Message {
    message: String
  }

  type Query {
    getPosts: [Post]
    getPostById(_id: ID): Post
  }

  type Mutation {
    createPost(content: String!, tags: [String], imgUrl: String): Post
    addComment(postId: ID!, content: String!): Message
    addLike(postId: ID!): Message
  }
`;

const PostResolvers = {
  Query: {
    //* ─── Get All Posts ───────────────────────────────────────────────────
    getPosts: async (_, __, contextValue) => {
      contextValue.authN();
      const result = await Post.getPosts();
      // console.log("🚀 ~ getPosts: ~ result:", result);
      return result;
    },

    //* ─── Get Post By Id ───────────────────────────────────────────────────
    getPostById: async (_, { _id }, contextValue) => {
      contextValue.authN();
      return await Post.getPostById(_id);
    },
  },
  Mutation: {
    //* ─── Create Post ─────────────────────────────────────────────────────
    createPost: async (_, { content, tags, imgUrl }, contextValue) => {
      contextValue.authN();
      const { _id: authorId } = contextValue.authN();

      if (!content) {
        throw new Error("Content is required");
      }

      const postData = {
        content,
        tags,
        imgUrl,
        authorId: new ObjectId(authorId),
        comments: [],
        likes: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await Post.createPost(postData);

      return postData;
    },

    //* ─── Add Comment ─────────────────────────────────────────────────────
    addComment: async (_, { postId, content }, contextValue) => {
      contextValue.authN();
      const { username } = contextValue.authN();

      const commentData = {
        username,
        content,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await Post.addComment(postId, commentData);

      return { message: "Success to comment the post" };
      // return post;
    },

    //* ─── Add Like ─────────────────────────────────────────────────────
    addLike: async (_, { postId }, contextValue) => {
      contextValue.authN();
      const { username } = contextValue.authN();

      const likeData = {
        username,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await Post.addLike(postId, likeData);
      // console.log("🚀 ~ addLike: ~ likeData:", likeData);
      return { message: "Success to like the post" };
    },
  },
};

module.exports = {
  postTypeDefs,
  PostResolvers,
};
