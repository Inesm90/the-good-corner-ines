import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { TagsResolver } from "./resolvers/Tags";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { AdsResolver } from "./resolvers/Ads";
import { CategoriesResolver } from "./resolvers/Categories";
import { dataSource } from "./datasource";


async function start() {
const schema = await buildSchema({
  resolvers : [TagsResolver, CategoriesResolver, AdsResolver]
});

const server = new ApolloServer({
  schema
});

await dataSource.initialize();
await startStandaloneServer(server, {
  listen : {
    port : 4000
  }
})
console.log("Server started") 
}

start()
