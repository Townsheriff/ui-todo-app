import {
  ListTodoListsQuery,
  ListTodoListsDocument,
  CreateTodoItemMutation,
} from "../schema";
import { ApolloCache } from "@apollo/client";

export const addTodoItemCache = ({
  cache,
  newItem,
  optimistic,
}: {
  cache: ApolloCache<any>;
  newItem?: CreateTodoItemMutation["createTodoItem"];
  optimistic: boolean;
}) => {
  cache.updateQuery<ListTodoListsQuery>(
    {
      query: ListTodoListsDocument,
      optimistic: optimistic,
    },
    (cachedData) => {
      if (!cachedData || !newItem) {
        return cachedData;
      }

      return {
        listTodoLists: cachedData.listTodoLists.map((list) => {
          if (list.id !== newItem.listId) {
            return { ...list };
          }

          const hasDuplicate = list.items.find(
            (item) => item.id === newItem.id
          );

          const items = !hasDuplicate ? [...list.items, newItem] : list.items;

          return {
            ...list,
            items,
          };
        }),
      };
    }
  );
};
