import React, { ChangeEvent, useCallback, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import { useCreateTodoList } from "../../store/hooks/use-create-todo-list";

export type TodoListModalFormProps = {
  open: boolean;
  onClose: () => void;
};

export const TodoListModalForm = (props: TodoListModalFormProps) => {
  const [createTodoList] = useCreateTodoList();
  const [title, setTitle] = useState("");

  const handleCreateList = useCallback(async () => {
    await createTodoList({
      variables: {
        title: title,
      },
    });

    props.onClose();
  }, [createTodoList, title, props.onClose]);

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogTitle>Create New Todo List</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="List Name"
          fullWidth
          variant="standard"
          onChange={handleTitleChange}
          value={title}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>Cancel</Button>
        <Button onClick={handleCreateList}>Create</Button>
      </DialogActions>
    </Dialog>
  );
};
