import { randomUUID } from "crypto";
import {
  DeleteCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import {
  CreateTodoItemArgs,
  DeleteTodoItemArgs,
  UpdateTodoItemArgs,
} from "../args/todo-item";
import { TodoItemEntity } from "../entities/todo-item-entity";
import { ApolloContext } from "../server/context";
import { TodoItem } from "../types/todo-item-type";
import { CreateTodoListArgs, DeleteTodoListArgs } from "../args/todo-list";
import { TodoList } from "../types/todo-list-type";
import { TodoListEntity } from "../entities/todo-list-entity";
import { AttributeValue } from "@aws-sdk/client-dynamodb";

const createTodoItem = async (
  args: CreateTodoItemArgs,
  ctx: ApolloContext
): Promise<TodoItem> => {
  const now = Date.now();
  const id = randomUUID();

  const todoItem: TodoItemEntity = {
    pk: "TODO_LIST",
    id: id,
    insertOrder: `/${args.listId}/${now}/${id}/`,
    checked: args.checked ?? false,
    content: args.content ?? "",
    listId: args.listId,
  };

  await ctx.dynamoClient.send(
    new PutCommand({
      TableName: ctx.tableName,
      Item: TodoItemEntity.parse(todoItem),
    })
  );

  return todoItem;
};

const deleteTodoItem = async (
  args: DeleteTodoItemArgs,
  ctx: ApolloContext
): Promise<void> => {
  await ctx.dynamoClient.send(
    new DeleteCommand({
      TableName: ctx.tableName,
      Key: {
        pk: "TODO_LIST",
        id: args.id,
      },
    })
  );
};

const updateTodoItem = async (
  args: UpdateTodoItemArgs,
  ctx: ApolloContext
): Promise<TodoItem> => {
  const updateExpression: string[] = [];
  const attributeValues: { [key: string]: unknown } = {};

  if (typeof args.checked !== "undefined") {
    updateExpression.push("checked = :checked");
    attributeValues[":checked"] = args.checked;
  }

  if (typeof args.content !== "undefined") {
    updateExpression.push("content = :content");
    attributeValues[":content"] = args.content;
  }

  if (!updateExpression.length) {
    throw new Error("TODO return existing todo");
  }

  const response = await ctx.dynamoClient.send(
    new UpdateCommand({
      TableName: ctx.tableName,
      Key: {
        pk: "TODO_LIST",
        id: args.id,
      },
      UpdateExpression: `set ${updateExpression.join(", ")}`,
      ExpressionAttributeValues: attributeValues,
      ReturnValues: "ALL_NEW",
    })
  );

  return TodoItemEntity.parse(response.Attributes);
};

const createTodoList = async (
  args: CreateTodoListArgs,
  ctx: ApolloContext
): Promise<TodoList> => {
  const now = Date.now();
  const id = randomUUID();

  const todoList: TodoListEntity = {
    pk: "TODO_LIST",
    id: id,
    insertOrder: `/${id}/${now}/`,
    title: args.title ?? "",
  };

  await ctx.dynamoClient.send(
    new PutCommand({
      TableName: ctx.tableName,
      Item: TodoListEntity.parse(todoList),
    })
  );

  return {
    ...todoList,
    items: [],
  };
};

const deleteTodoList = async (
  args: DeleteTodoListArgs,
  ctx: ApolloContext
): Promise<void> => {
  await ctx.dynamoClient.send(
    new DeleteCommand({
      TableName: ctx.tableName,
      Key: {
        pk: "TODO_LIST",
        id: args.id,
      },
    })
  );
};

const listTodoLists = async (ctx: ApolloContext): Promise<TodoList[]> => {
  let startKey: Record<string, AttributeValue> | undefined;

  const todoLists = new Map<string, TodoList>();
  const todoItems: TodoItem[] = [];

  do {
    const response = await ctx.dynamoClient.send(
      new QueryCommand({
        ExclusiveStartKey: startKey,
        TableName: ctx.tableName,
        IndexName: ctx.orderIndexName,
        KeyConditionExpression:
          "pk = :pk AND begins_with(insertOrder, :insertOrder)",
        ExpressionAttributeValues: {
          ":pk": "TODO_LIST",
          ":insertOrder": "/",
        },
      })
    );

    (response.Items || []).forEach((item) => {
      const todoListResult = TodoListEntity.try(item);

      if (todoListResult.ok) {
        todoLists.set(todoListResult.value.id, {
          ...todoListResult.value,
          items: [],
        });

        return;
      }

      const todoItemResult = TodoItemEntity.try(item);

      if (todoItemResult.ok) {
        todoItems.push(todoItemResult.value);
      }
    });

    if (!response.LastEvaluatedKey) {
      break;
    }

    startKey = response.LastEvaluatedKey;
  } while (startKey);

  todoItems.forEach((item) => {
    const list = todoLists.get(item.listId);

    if (list) {
      list.items.push(item);
    }
  });

  return Array.from(todoLists.values());
};

export const todoTable = {
  createTodoItem,
  deleteTodoItem,
  updateTodoItem,
  createTodoList,
  deleteTodoList,
  listTodoLists,
};
