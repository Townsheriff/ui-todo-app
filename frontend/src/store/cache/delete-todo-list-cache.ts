import {
  ListTodoListsQuery,
  ListTodoListsDocument,
  DeleteTodoListMutation,
} from "../schema";
import { ApolloCache } from "@apollo/client";

export const deleteTodoListCache = ({
  cache,
  newItem,
  optimistic,
}: {
  cache: ApolloCache<any>;
  newItem?: DeleteTodoListMutation["deleteTodoList"];
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

      const newList = cachedData.listTodoLists.filter((list) => {
        return list.id !== newItem;
      });

      return {
        listTodoLists: [...newList],
      };
    }
  );
};
