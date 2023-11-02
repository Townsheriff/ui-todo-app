import { useSnackbar } from "notistack";
import {
  useListTodoListsQuery,
  useTodoAddedSubscription,
  useTodoListAddedSubscription,
  useTodoListRemovedSubscription,
  useTodoRemovedSubscription,
  useTodoUpdatedSubscription,
} from "../schema";
import { addTodoItemCache } from "../cache/add-todo-item-cache";
import { addTodoListCache } from "../cache/add-todo-list-cache";
import { deleteTodoItemCache } from "../cache/delete-todo-item-cache";
import { deleteTodoListCache } from "../cache/delete-todo-list-cache";
import { updateTodoItemCache } from "../cache/update-todo-item-cache";

export const useListTodoLists = () => {
  const { enqueueSnackbar } = useSnackbar();

  useTodoAddedSubscription({
    onData: (options) => {
      const cache = options.client.cache;
      const newItem = options.data.data?.todoAdded;

      addTodoItemCache({
        cache,
        newItem: newItem,
        optimistic: false,
      });
    },
    onError: (err) => {
      enqueueSnackbar(err.message, {
        variant: "error",
      });
    },
  });

  useTodoRemovedSubscription({
    onData: (options) => {
      const cache = options.client.cache;
      const newItem = options.data.data?.todoRemoved;

      deleteTodoItemCache({
        cache,
        newItem,
        optimistic: false,
      });
    },
    onError: (err) => {
      enqueueSnackbar(err.message, {
        variant: "error",
      });
    },
  });

  useTodoUpdatedSubscription({
    onData: (options) => {
      const cache = options.client.cache;
      const newItem = options.data.data?.todoUpdated;

      updateTodoItemCache({
        cache,
        newItem,
        optimistic: false,
      });
    },
    onError: (err) => {
      enqueueSnackbar(err.message, {
        variant: "error",
      });
    },
  });

  useTodoListAddedSubscription({
    onData: (options) => {
      const cache = options.client.cache;
      const newItem = options.data.data?.todoListAdded;

      addTodoListCache({
        cache,
        newItem,
        optimistic: false,
      });
    },
    onError: (err) => {
      enqueueSnackbar(err.message, {
        variant: "error",
      });
    },
  });

  useTodoListRemovedSubscription({
    onData: (options) => {
      const cache = options.client.cache;
      const newItem = options.data.data?.todoListRemoved;

      deleteTodoListCache({
        cache,
        optimistic: false,
        newItem,
      });
    },
    onError: (err) => {
      enqueueSnackbar(err.message, {
        variant: "error",
      });
    },
  });

  return useListTodoListsQuery({
    onError: (err) => {
      enqueueSnackbar(err.message, {
        variant: "error",
      });
    },
  });
};
