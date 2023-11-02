import { DynamoDBRecord } from "aws-lambda";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { TodoItemEntity } from "../../entities/todo-item-entity";
import { TodoListEntity } from "../../entities/todo-list-entity";
import { TodoItem } from "../../types/todo-item-type";
import { TodoList } from "../../types/todo-list-type";
import {
  PostToConnectionCommand,
  ApiGatewayManagementApiClient,
} from "@aws-sdk/client-apigatewaymanagementapi";

const wsApiEndpoint = process.env.WS_API_ENDPOINT;
const client = new ApiGatewayManagementApiClient({ endpoint: wsApiEndpoint });

export type SubscriptionPayload = ReturnType<typeof mapRecordToPayload>;

type TodoItemTypename = TodoItem & { __typename: "TodoItem" };
type TodoListTypename = TodoList & { __typename: "TodoList" };

export const mapRecordToPayload = (record: DynamoDBRecord) => {
  const rawImage =
    record.eventName === "INSERT" || record.eventName === "MODIFY"
      ? record.dynamodb?.NewImage
      : record.dynamodb?.OldImage;

  const image = unmarshall(rawImage as any);

  const todoItemResult = TodoItemEntity.try(image);
  const todoListResult = TodoListEntity.try(image);

  if (record.eventName === "INSERT") {
    if (todoItemResult.ok) {
      const todoItem: TodoItemTypename = {
        __typename: "TodoItem",
        checked: todoItemResult.value.checked,
        content: todoItemResult.value.content,
        id: todoItemResult.value.id,
        listId: todoItemResult.value.listId,
      };

      return {
        topic: "TodoAdded",
        data: {
          todoAdded: todoItem,
        },
      };
    }

    if (todoListResult.ok) {
      const todoList: Omit<TodoListTypename, "items"> = {
        __typename: "TodoList",
        id: todoListResult.value.id,
        title: todoListResult.value.title,
      };

      return {
        topic: "TodoListAdded",
        data: {
          todoListAdded: todoList,
        },
      };
    }
  }

  if (record.eventName === "REMOVE") {
    if (todoItemResult.ok) {
      return {
        topic: "TodoRemoved",
        data: {
          todoRemoved: todoItemResult.value.id,
        },
      };
    }

    if (todoListResult.ok) {
      return {
        topic: "TodoListRemoved",

        data: {
          todoListRemoved: todoListResult.value.id,
        },
      };
    }
  }

  if (record.eventName === "MODIFY") {
    if (todoItemResult.ok) {
      const todoItem: TodoItemTypename = {
        __typename: "TodoItem",
        checked: todoItemResult.value.checked,
        content: todoItemResult.value.content,
        id: todoItemResult.value.id,
        listId: todoItemResult.value.listId,
      };

      return {
        topic: "TodoUpdated",
        data: {
          todoUpdated: todoItem,
        },
      };
    }
  }

  throw new Error(`Unhandled record ${record.dynamodb}`);
};

export const createPayloadBuckets = (records: DynamoDBRecord[]) => {
  return records
    .map((record) => {
      return mapRecordToPayload(record);
    })
    .filter((item) => !!item)
    .reduce<{ [key: string]: SubscriptionPayload[] }>((acc, curr) => {
      if (!acc[curr.topic]) {
        acc[curr.topic] = [];
      }

      acc[curr.topic].push(curr);

      return acc;
    }, {});
};

export const sendMessageToConnection = async (
  connectionId: string,
  message: unknown
) => {
  await client.send(
    new PostToConnectionCommand({
      ConnectionId: connectionId,
      Data: JSON.stringify(message),
    })
  );
};
