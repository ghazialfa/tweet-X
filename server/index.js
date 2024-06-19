require("dotenv").config();
const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { userTypeDefs, userResolvers } = require("./schema/user");
const { postTypeDefs, PostResolvers } = require("./schema/post");
const { verifyToken } = require("./helpers/jwt");
const { followTypeDefs, followResolvers } = require("./schema/follow");

const PORT = process.env.PORT || 4000;

const server = new ApolloServer({
  typeDefs: [userTypeDefs, postTypeDefs, followTypeDefs],
  resolvers: [userResolvers, PostResolvers, followResolvers],
  introspection: true,
  cors: {
    origin: "*",
    methods: "GET, POST",
    allowedHeaders: ["Content-Type", "Authorization"],
  },
});

startStandaloneServer(server, {
  listen: { port: PORT },
  context: ({ req, res }) => {
    return {
      authN: () => {
        const access_token = req.headers.authorization;

        if (!access_token) {
          throw new Error("Unauthorized");
        }

        const [type, token] = access_token.split(" ");

        if (type !== "Bearer") {
          throw new Error("Unauthorized");
        }

        const user = verifyToken(token);
        return user;
      },
    };
  },
}).then(({ url }) => {
  console.log(`🚀  Server ready at: ${url}`);
});
