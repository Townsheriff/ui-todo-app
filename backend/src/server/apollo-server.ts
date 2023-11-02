import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { ApolloServer } from "@apollo/server";
import { TodoListResolver } from "../resolvers/todo-list-resolver";
import { TodoItemResolver } from "../resolvers/todo-item-resolver";

export const createApolloServer = async () => {
  const schema = await buildSchema({
    resolvers: [TodoListResolver, TodoItemResolver],
  });

  const apolloServer = new ApolloServer({
    schema,
  });

  return apolloServer;
};
