import { MongoClient } from "mongodb"
import { DinosaurModel } from "./types.ts";
import { schema } from "./schema.ts";
import { ApolloServer } from "npm:@apollo/server"
import { resolvers } from "./resolvers.ts";
import { startStandaloneServer } from "npm:@apollo/server/standalone"


const MONGO_URL = Deno.env.get("MONGO_URL");

if(!MONGO_URL) {
  throw new Error("Please provide a MONGO_URL");
}

const mongoClient = new MongoClient(MONGO_URL);
await mongoClient.connect();

console.info("Connected to MongoDB");

const mongoDB = mongoClient.db("dinosaurs");
const DinosaursCollection = mongoDB.collection<DinosaurModel>("dinosaurs");

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
})

const { url } = await startStandaloneServer(server, {
  context: async() => ({DinosaursCollection}),
});

console.info(`Server ready at ${url}`)
