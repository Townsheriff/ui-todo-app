import {
  ListTodoListsQuery,
  ListTodoListsDocument,
  CreateTodoListMutation,
  TodoListAddedSubscription,
} from "../schema";
import { ApolloCache } from "@apollo/client";

export const addTodoListCache = ({
  cache,
  newItem,
  optimistic,
}: {
  cache: ApolloCache<any>;
  newItem?:
    | CreateTodoListMutation["createTodoList"]
    | TodoListAddedSubscription["todoListAdded"];
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

      const hasDuplicate = cachedData.listTodoLists.find(
        (list) => list.id === newItem.id
      );

      if (hasDuplicate) {
        return cachedData;
      }

      const normalizedItem = {
        ...newItem,
        items: "items" in newItem ? newItem.items : [],
      };

      return {
        listTodoLists: [normalizedItem, ...cachedData.listTodoLists],
      };
    }
  );
};
