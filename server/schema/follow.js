const { ObjectId } = require("mongodb");
const Follow = require("../models/Follow_model");

const followTypeDefs = `#graphql
  type Follow {
    _id: ID
    followerId: ID
    followingId: ID
    createdAt: String
    updatedAt: String
    FollowerData: [FollowerData]
    FollowingData: [FollowingData]
  }

  type FollowerData {
    _id: ID
    name: String
    username: String
    email: String
  }

  type FollowingData {
    _id: ID
    name: String
    username: String
    email: String
  }

  type Message {
    message: String
  }

  type Query {
    getFollowers(userId: ID): Follow
    getFollowing(userId: ID): Follow
  }

  type Mutation {
    addFollow(_id: ID): Message
    removeFollow(_id: ID): Message
    checkFollow(_id: ID): Boolean
  }
`;

const followResolvers = {
  Query: {
    //* ─── Get Following ────────────────────────────────────────────────
    getFollowing: async (_, { userId }, contextValue) => {
      contextValue.authN();
      // const { _id: userId } = contextValue.authN();
      // console.log("🚀 ~ getFollowing: ~ userId:", userId);
      const result = await Follow.getFollowing(userId);
      // console.log("🚀 ~ getFollowing: ~ result:", result);
      if (result.length === 0) {
        throw new Error("No Following Yet");
      }
      return result;
    },

    //* ─── Get Followers ────────────────────────────────────────────────
    getFollowers: async (_, { userId }, contextValue) => {
      contextValue.authN();
      // const { _id: userId } = contextValue.authN();
      // console.log("🚀 ~ getFollowers: ~ userId:", userId);
      const result = await Follow.getFollowers(userId);
      // console.log("🚀 ~ getFollowers: ~ result:", result);
      if (result.length === 0) {
        throw new Error("No Followers Yet");
      }
      return result;
    },
  },
  Mutation: {
    //* ─── Add Follow ──────────────────────────────────────────────
    addFollow: async (_, { _id: followingId }, contextValue) => {
      contextValue.authN();
      const { _id: followerId } = contextValue.authN();
      // console.log("🚀 ~ addFollow: ~ followerId:", followerId);

      //* Check if already following
      const checkFollow = await Follow.checkFollow(followerId, followingId);

      if (checkFollow) {
        throw new Error("Already Following");
      } else if (followingId == followerId) {
        throw new Error("Cannot Follow Yourself");
      }

      const followData = {
        followerId: new ObjectId(followerId),
        followingId: new ObjectId(followingId),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      // console.log("🚀 ~ addFollow: ~ followData:", followData);

      const result = await Follow.addFollow(followData);

      return { message: "Following" };
    },

    //* ─── Remove Follow ────────────────────────────────────────────────
    removeFollow: async (_, { _id: followingId }, contextValue) => {
      // console.log("🚀 ~ removeFollow: ~ followingId:", followingId);
      contextValue.authN();
      const { _id: followerId } = contextValue.authN();
      // console.log("🚀 ~ removeFollowa: ~ followerId:", followerId);

      //* Check if already following
      const checkFollow = await Follow.checkFollow(followerId, followingId);

      if (!checkFollow) {
        throw new Error("Not Following");
      }

      const followData = {
        followerId: new ObjectId(followerId),
        followingId: new ObjectId(followingId),
      };

      const result = await Follow.removeFollow(followData);
      return { message: "Unfollowed" };
    },

    //* ─── Check Follow ───────────────────────────────────────────────────
    checkFollow: async (_, { _id: followingId }, contextValue) => {
      contextValue.authN();
      const { _id: followerId } = contextValue.authN();

      const result = await Follow.checkFollow(followerId, followingId);

      if (!result) {
        return false;
      }
      return true;
    },
  },
};

module.exports = { followTypeDefs, followResolvers };
