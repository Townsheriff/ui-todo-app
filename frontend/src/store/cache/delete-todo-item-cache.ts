import {
  ListTodoListsQuery,
  ListTodoListsDocument,
  DeleteTodoItemMutation,
} from "../schema";
import { ApolloCache } from "@apollo/client";

export const deleteTodoItemCache = ({
  cache,
  newItem,
  optimistic,
}: {
  cache: ApolloCache<any>;
  newItem?: DeleteTodoItemMutation["deleteTodoItem"];
  optimistic: boolean;
}) => {
  cache.updateQuery<ListTodoListsQuery>(
    {
      query: ListTodoListsDocument,
      optimistic: optimistic,
    },
    (cachedData) => {
      if (!cachedData) {
        return cachedData;
      }

      return {
        listTodoLists: cachedData.listTodoLists.map((list) => {
          const items = list.items.filter((item) => item.id !== newItem);

          return {
            ...list,
            items: [...items],
          };
        }),
      };
    }
  );
};
