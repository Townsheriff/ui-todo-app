import { ContextFunction } from "@apollo/server";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export type ApolloContext = {
  dynamoClient: DynamoDBClient;
  tableName: string;
  orderIndexName: string;
};

type ContextHandler = ContextFunction<any[], ApolloContext>;

export const createContext: () => ContextHandler = () => {
  const dynamoClient = new DynamoDBClient({ region: "eu-central-1" });
  const tableName = process.env.TODO_LIST_TABLE!;
  const orderIndexName = "insertOrder";

  return async () => {
    return {
      dynamoClient,
      tableName,
      orderIndexName,
    };
  };
};
