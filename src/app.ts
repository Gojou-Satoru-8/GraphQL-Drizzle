import express from "express";
import helmet from "helmet";
import cors from "cors";
import { expressMiddleware } from "@apollo/server/express4";
import {
  // connectGraphQL,
  createGraphQLServer,
} from "./graphql";
import { errorMiddleware } from "@/middlewares/error.js";
import userRouter from "@/routes/user.router";

export const envMode = process.env.NODE_ENV?.trim() || "DEVELOPMENT";
const portWeb = 3000;

// SECTION: Two ways of creating a graphql server:
// (1) Standalone server:
// const portGraphQL = Number(process.env.PORT) || 3001;
// connectGraphQL(portGraphQL);
// (2) GraphQL serve as an express middleware:
const graphQLServer = await createGraphQLServer();
// NOTE: Top level await in express is possible since ES2022
// Also, requires await server.start() and express.json() middleware

const app = express();

// app.use(
//   helmet({
//     contentSecurityPolicy: envMode !== "DEVELOPMENT",
//     crossOriginEmbedderPolicy: envMode !== "DEVELOPMENT",
//   })
// );

app.use(express.json()); // This is required for expressMiddlware(graphQLServer) to work, as it expects the body to be in json forma
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: " * ", credentials: true }));

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// // your routes here

app.use("/api/users", userRouter);
app.use("/graphql", expressMiddleware(graphQLServer));

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
