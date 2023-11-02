import { useSnackbar } from "notistack";
import { useDeleteTodoListMutation } from "../schema";
import { deleteTodoListCache } from "../cache/delete-todo-list-cache";

const optimisticId = "optimistic-id";

export const useDeleteTodoList = () => {
  const { enqueueSnackbar } = useSnackbar();

  return useDeleteTodoListMutation({
    optimisticResponse: () => ({
      deleteTodoList: optimisticId,
    }),
    update: (cache, result) => {
      deleteTodoListCache({
        cache,
        newItem: result.data?.deleteTodoList,
        optimistic: result.data?.deleteTodoList === optimisticId,
      });
    },
    onError: (err) => {
      enqueueSnackbar(err.message, {
        variant: "error",
      });
    },
  });
};
