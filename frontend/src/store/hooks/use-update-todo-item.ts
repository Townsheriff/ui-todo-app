import { useSnackbar } from "notistack";
import { useUpdateTodoItemMutation } from "../schema";
import { updateTodoItemCache } from "../cache/update-todo-item-cache";

const optimisticId = "optimistic-id";

export const useUpdateTodoItem = () => {
  const { enqueueSnackbar } = useSnackbar();

  return useUpdateTodoItemMutation({
    optimisticResponse: (variables) => ({
      updateTodoItem: {
        checked: variables.checked,
        content: variables.content,
        id: variables.id,
        listId: optimisticId,
      },
    }),
    update: (cache, result) => {
      updateTodoItemCache({
        cache,
        newItem: result.data?.updateTodoItem,
        optimistic: optimisticId === result.data?.updateTodoItem.listId,
      });
    },
    onError: (err) => {
      enqueueSnackbar(err.message, {
        variant: "error",
      });
    },
  });
};
