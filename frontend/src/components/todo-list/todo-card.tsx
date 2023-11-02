import React, { ReactElement, useCallback, useMemo } from "react";
import { TodoItem, TodoItemProps } from "../todo-item/todo-item";
import { Card, CardContent, CardHeader, IconButton } from "@mui/material";
import { TodoList } from "../../store/schema";
import { VBox } from "../../atoms/containers.styled";
import ClearIcon from "@mui/icons-material/Clear";
import { useDeleteTodoList } from "../../store/hooks/use-delete-todo-list";

export type TodoCardProps = {
  todoList: TodoList;
};

export const TodoCard = (props: TodoCardProps) => {
  const [deleteTodoList] = useDeleteTodoList();

  const handleDelete = useCallback(async () => {
    await deleteTodoList({
      variables: {
        id: props.todoList.id,
      },
    });
  }, [props.todoList.id]);

  const items: ReactElement<TodoItemProps>[] = useMemo(() => {
    const arr = props.todoList.items.map((item) => {
      return <TodoItem todoItem={item} key={item.id} />;
    });

    const newItem = (
      <TodoItem
        key=""
        todoItem={{
          checked: false,
          content: "",
          id: "",
          listId: props.todoList.id,
        }}
      />
    );

    arr.push(newItem);

    return arr;
  }, [props.todoList]);

  return (
    <Card sx={{ minWidth: "400px" }}>
      <CardHeader
        title={props.todoList.title}
        action={
          <IconButton onClick={handleDelete}>
            <ClearIcon />
          </IconButton>
        }
      ></CardHeader>
      <CardContent>
        <VBox>{items}</VBox>
      </CardContent>
    </Card>
  );
};
