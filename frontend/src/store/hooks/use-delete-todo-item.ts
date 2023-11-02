import { useSnackbar } from "notistack";
import { useDeleteTodoItemMutation } from "../schema";
import { deleteTodoItemCache } from "../cache/delete-todo-item-cache";

const optimisticId = "optimistic-id";

export const useDeleteTodoItem = () => {
  const { enqueueSnackbar } = useSnackbar();

  return useDeleteTodoItemMutation({
    optimisticResponse: () => ({
      deleteTodoItem: optimisticId,
    }),
    update: (cache, result) => {
      deleteTodoItemCache({
        cache,
        newItem: result.data?.deleteTodoItem,
        optimistic: optimisticId === result.data?.deleteTodoItem,
      });
    },
    onError: (err) => {
      enqueueSnackbar(err.message, {
        variant: "error",
      });
    },
  });
};
