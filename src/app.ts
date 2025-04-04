import express from "express";
import helmet from "helmet";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { schema } from "./graphql/schema";
import { errorMiddleware } from "@/middlewares/error.js";
import userRouter from "@/routes/user.router";
import { db } from "./drizzle/database";
import { Users } from "./drizzle/schema";

export const envMode = process.env.NODE_ENV?.trim() || "DEVELOPMENT";
const portWeb = 3000;
const portGraphQL = Number(process.env.PORT) || 3001;

const server = new ApolloServer({
  typeDefs: schema,
  resolvers: {
    Query: {
      hello: () => "Hello world!",
      hello2: () => "Hello world!",
      // users: async () => (await db.select().from(Users)).values(),
    },
  },
});

startStandaloneServer(server, {
  listen: { port: portGraphQL },
});
const app = express();

// app.use(
//   helmet({
//     contentSecurityPolicy: envMode !== "DEVELOPMENT",
//     crossOriginEmbedderPolicy: envMode !== "DEVELOPMENT",
//   })
// );

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: " * ", credentials: true }));

app.get("/", (req, res) => {
  res.send("Hello, World!");
});
app.use("/api/users", userRouter);

// // your routes here

app.get("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Page not found",
  });
});

app.use(errorMiddleware);

app.listen(portWeb, () =>
  console.log("Server is working on Port:" + portWeb + " in " + envMode + " Mode.")
);
