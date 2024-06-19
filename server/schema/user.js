const { hashPassword, comparePassword } = require("../helpers/bcrypt");
const { createToken } = require("../helpers/jwt");
const User = require("../models/User_model");

const userTypeDefs = `#graphql
  type User {
    name: String
    username: String
    email: String
    # password: String
    _id: ID
    access_token: String
  }

  type Query {
    getUsers: [User]
    getUserByUsername(username: String): [User]
    getUserById(_id: ID): User
  }

  type Mutation {
    register(name: String, username: String!, email: String!, password: String!): User
    login(username: String!, password: String!): User
  }
`;

const userResolvers = {
  Query: {
    //* ─── Get User By Username ────────────────────────────────────
    getUserByUsername: async (_, { username }, contextValue) => {
      contextValue.authN();
      // console.log("🚀 ~ username:", username);
      // const findUser = User.find((u) => u.username === username);
      const findUser = await User.getUserByUsername(username);

      if (!findUser) {
        throw new Error("User not found");
      }
      return findUser;
    },

    //* ─── Get User By Id ──────────────────────────────────────────
    getUserById: async (_, { _id }, contextValue) => {
      // contextValue.authN();
      const findUser = await User.getUserById(_id);

      if (!findUser) {
        throw new Error("User not found");
      }
      return findUser;
    },
  },

  Mutation: {
    //* ─── Register ────────────────────────────────────────────────
    register: async (_, { name, username, email, password }) => {
      if (!username) {
        throw new Error("Username is required");
      }

      const emailUsed = await User.userCollection().findOne({ email });

      if (emailUsed) {
        throw new Error("Email already used");
      }

      if (!email) {
        throw new Error("Email is required");
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error("Email format is invalid");
      }

      if (!password) {
        throw new Error("Password is required");
      }

      const newUser = {
        name,
        username,
        email,
        password: hashPassword(password),
      };

      await User.register(newUser);
      return newUser;
    },

    //* ─── Login ───────────────────────────────────────────────────
    login: async (_, { username, password }) => {
      // console.log("🚀 ~ login: ~ password:", password);

      if (!username) {
        throw new Error("Username is required");
      }

      if (!password) {
        throw new Error("Password is required");
      }

      const [findUser] = await User.getUserByUsername(username);
      // console.log("🚀 ~ login: ~ findUser:", findUser);

      if (!findUser) {
        throw new Error("Username or Password is incorrect");
      }

      const trueUser = comparePassword(password, findUser.password);
      // console.log("🚀 ~ login: ~ trueUser:", trueUser);
      // console.log("🚀 ~ login: ~ findUser:", findUser);

      if (!trueUser) {
        throw new Error("Username or Password is incorrect");
      }

      // console.log(access_token, "access_token nih");

      const access_token = createToken({
        _id: findUser._id,
        username: findUser.username,
      });

      return {
        ...findUser,
        access_token,
      };
    },
  },
};

module.exports = { userTypeDefs, userResolvers };
