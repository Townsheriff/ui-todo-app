import { useSnackbar } from "notistack";
import { useCreateTodoListMutation } from "../schema";
import { addTodoListCache } from "../cache/add-todo-list-cache";

const optimisticId = "optimistic-id";

export const useCreateTodoList = () => {
  const { enqueueSnackbar } = useSnackbar();

  return useCreateTodoListMutation({
    optimisticResponse: (variables) => ({
      createTodoList: {
        __typename: "TodoList",
        id: optimisticId,
        items: [],
        title: variables.title,
      },
    }),
    update: (cache, result) => {
      addTodoListCache({
        cache,
        optimistic: result.data?.createTodoList.id === optimisticId,
        newItem: result.data?.createTodoList,
      });
    },
    onError: (err) => {
      enqueueSnackbar(err.message, {
        variant: "error",
      });
    },
  });
};
