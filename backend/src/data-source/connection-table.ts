import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { ConnectionEntity } from "../entities/connection-entity";
import {
  DeleteCommand,
  PutCommand,
  QueryCommand,
  BatchWriteCommand,
} from "@aws-sdk/lib-dynamodb";

const tableName = process.env.CONNECTION_TABLE_NAME!;
const client = new DynamoDBClient({ region: "eu-central-1" });

const putItem = async (item: ConnectionEntity) => {
  await client.send(
    new PutCommand({
      TableName: tableName,
      Item: item,
    })
  );
};

const deleteItem = async (connectionId: string) => {
  await client.send(
    new DeleteCommand({
      TableName: tableName,
      Key: {
        connectionId: connectionId,
      },
    })
  );
};

const getAllSubscriptions = async (topic: string) => {
  let exclusiveStartKey: any;
  let allItems: ConnectionEntity[] = [];

  do {
    const params = {
      TableName: tableName,
      IndexName: "topic",
      KeyConditionExpression: "topic = :topic",
      ExpressionAttributeValues: {
        ":topic": topic,
      },
      ExclusiveStartKey: exclusiveStartKey,
    };

    const response = await client.send(new QueryCommand(params));

    if (response.Items) {
      allItems = allItems.concat(
        response.Items.map((item) => ConnectionEntity.parse(item))
      );
    }

    exclusiveStartKey = response.LastEvaluatedKey;
  } while (exclusiveStartKey);

  return allItems;
};

const deleteSubscriptions = async (conn: string) => {
  const params = {
    TableName: tableName,
    KeyConditionExpression: "connectionId = :connectionId",
    ExpressionAttributeValues: {
      ":connectionId": conn,
    },
  };

  const response = await client.send(new QueryCommand(params));

  if (!response.Items || !response.Items.length) {
    return;
  }

  const deleteRequests = response.Items.map((item) => {
    return {
      DeleteRequest: {
        Key: {
          id: item.id,
          connectionId: item.connectionId,
        },
      },
    };
  });

  const batchParams = {
    RequestItems: {
      [tableName]: deleteRequests,
    },
  };

  await client.send(new BatchWriteCommand(batchParams));
};

export const connectionTable = {
  putItem,
  deleteItem,
  getAllSubscriptions,
  deleteSubscriptions,
};
