import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { TagsResolver } from "./resolvers/Tags";
import { ApolloServer } from "@apollo/server";
import { AdsResolver } from "./resolvers/Ads";
import { CategoriesResolver } from "./resolvers/Categories";
import { UsersResolver } from "./resolvers/Users";
import { dataSource } from "./datasource";
import { customAuthChecker, ContextType } from "./auth";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import http from "http";
import cors from "cors";

async function start() {
  await dataSource.initialize();
const schema = await buildSchema({
  resolvers : [AdsResolver, TagsResolver, CategoriesResolver, UsersResolver],
  authChecker: customAuthChecker,
});

const app = express();
const httpServer = http.createServer(app);

const server = new ApolloServer<ContextType>({
  schema,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

app.use(
  "/",
  cors<cors.CorsRequest>({
    origin: "http://localhost:3000",
    credentials: true,
  }),
  express.json({ limit: "50mb" }),
 
  expressMiddleware(server, {
    context: async (args) => {
      return {
        req: args.req,
        res: args.res,
      };
    },
  })
);

await new Promise<void>((resolve) =>
  httpServer.listen({ port: 4000 }, resolve)
);
console.log(`🚀 Server ready at http://localhost:4000/`);
}

start();
