import { Button, Checkbox } from "@mui/material";
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import { DeleteButton, StyledTextField } from "./todo-item.styled";
import { VBox, HBox } from "../../atoms/containers.styled";
import { TodoItem as TodoItemData } from "../../store/schema";
import { useCreateTodoItem } from "../../store/hooks/use-create-todo-item";
import { useUpdateTodoItem } from "../../store/hooks/use-update-todo-item";
import { useDeleteTodoItem } from "../../store/hooks/use-delete-todo-item";

export type TodoItemProps = {
  todoItem: TodoItemData;
};

export const TodoItem = (props: TodoItemProps) => {
  const todoItem = props.todoItem;

  const [createTodoItem, { loading: createLoading }] = useCreateTodoItem();
  const [updateTodoItem, { loading: updateLoading }] = useUpdateTodoItem();
  const [deleteTodoItem, { loading: deleteLoading }] = useDeleteTodoItem();

  const formDisabled = createLoading || updateLoading || deleteLoading;

  const [showEdit, setShowEdit] = useState(false);
  const [content, setContent] = useState(todoItem.content);
  const [checked, setChecked] = useState(todoItem.checked);

  useEffect(() => {
    setContent(todoItem.content);
  }, [todoItem.content, setContent]);

  useEffect(() => {
    setChecked(todoItem.checked);
  }, [todoItem.checked, setChecked]);

  const handleCancelEdit = useCallback(() => {
    setShowEdit(false);
    setContent(todoItem.content);
  }, [setShowEdit, setContent, todoItem.content]);

  const handleTextChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setContent(event.target.value);
    },
    [setContent]
  );

  const handleTextClick = useCallback(() => {
    if (!showEdit) {
      setShowEdit(true);
    }
  }, [showEdit, setShowEdit]);

  const handleCheckedChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      setChecked(event.target.checked);

      if (todoItem.id) {
        await updateTodoItem({
          variables: {
            id: todoItem.id,
            checked: event.target.checked,
            content: content,
          },
        });
      }
    },
    [setChecked, todoItem.id]
  );

  const handleSaveClick = useCallback(async () => {
    setShowEdit(false);

    if (!todoItem.id) {
      setContent("");
      setChecked(false);

      await createTodoItem({
        variables: {
          checked: checked,
          content: content,
          listId: todoItem.listId,
        },
      });
    } else {
      await updateTodoItem({
        variables: {
          id: todoItem.id,
          checked: checked,
          content: content,
        },
      });
    }
  }, [
    createTodoItem,
    updateTodoItem,
    content,
    checked,
    todoItem.id,
    setContent,
  ]);

  const handleDeleteClick = useCallback(async () => {
    if (!props.todoItem.id) {
      return;
    }

    await deleteTodoItem({
      variables: {
        id: props.todoItem.id,
      },
    });
  }, [deleteTodoItem, props.todoItem]);

  return (
    <VBox>
      <HBox>
        <Checkbox
          checked={checked}
          value={todoItem.checked}
          disabled={formDisabled}
          onChange={handleCheckedChange}
        />
        <StyledTextField
          multiline
          size="small"
          variant="standard"
          margin="none"
          value={content}
          onFocus={handleTextClick}
          onChange={handleTextChange}
          placeholder="Add an item"
          disabled={formDisabled}
        />
      </HBox>
      {showEdit && (
        <HBox>
          <Button
            variant="contained"
            size="small"
            onClick={handleSaveClick}
            disabled={formDisabled}
          >
            Save
          </Button>
          <Button
            variant="text"
            size="small"
            onClick={handleCancelEdit}
            disabled={formDisabled}
          >
            Cancel
          </Button>
          {props.todoItem.id && (
            <DeleteButton
              variant="contained"
              size="small"
              onClick={handleDeleteClick}
              disabled={formDisabled}
            >
              Delete
            </DeleteButton>
          )}
        </HBox>
      )}
    </VBox>
  );
};
