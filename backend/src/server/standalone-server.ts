import "reflect-metadata";
import express from "express";
import cors from "cors";
import { expressMiddleware } from "@apollo/server/express4";
import { createContext } from "./context";
import { createApolloServer } from "./apollo-server";

const port = 5000;

export const startServer = async () => {
  const app = express();
  const apolloServer = await createApolloServer();
  const context = createContext();

  await apolloServer.start();

  app.use(
    "/graphql",
    cors(),
    express.json(),
    expressMiddleware(apolloServer, {
      context,
    })
  );

  app.listen(port, () => {
    console.log(`Express with Apollo server ready at http://localhost:${port}`);
  });
};

startServer();
