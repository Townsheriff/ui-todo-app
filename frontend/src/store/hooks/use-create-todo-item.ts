import { useSnackbar } from "notistack";
import { useCreateTodoItemMutation } from "../schema";
import { addTodoItemCache } from "../cache/add-todo-item-cache";

const optimisticId = "optimistic-id";

export const useCreateTodoItem = () => {
  const { enqueueSnackbar } = useSnackbar();

  return useCreateTodoItemMutation({
    optimisticResponse: (variables) => ({
      createTodoItem: {
        __typename: "TodoItem",
        id: optimisticId,
        checked: variables.checked,
        content: variables.content,
        listId: variables.listId,
      },
    }),
    update: (cache, result) => {
      addTodoItemCache({
        cache,
        newItem: result.data?.createTodoItem,
        optimistic: result.data?.createTodoItem.id === optimisticId,
      });
    },
    onError: (err) => {
      enqueueSnackbar(err.message, {
        variant: "error",
      });
    },
  });
};
