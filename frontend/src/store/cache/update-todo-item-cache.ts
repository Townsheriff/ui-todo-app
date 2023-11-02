import { UpdateTodoItemMutation, TodoItem } from "../schema";
import { ApolloCache } from "@apollo/client";

export const updateTodoItemCache = ({
  cache,
  newItem,
  optimistic,
}: {
  cache: ApolloCache<any>;
  newItem?: UpdateTodoItemMutation["updateTodoItem"];
  optimistic: boolean;
}) => {
  if (!newItem) {
    return;
  }

  cache.modify<TodoItem>({
    optimistic: optimistic,
    id: cache.identify(newItem),
    fields: {
      checked: (checked) => newItem.checked ?? checked,
      content: (content) => newItem.content ?? content,
    },
  });
};
