import React, { useCallback, useMemo, useState } from "react";
import { TodoCard } from "../../components/todo-list/todo-card";
import AddIcon from "@mui/icons-material/Add";
import { HWrapBox } from "../../atoms/containers.styled";
import { StyledFab } from "./todo-page.styled";
import { TodoListModalForm } from "../../components/todo-list-modal-form/todo-list-modal-form";
import { useListTodoLists } from "../../store/hooks/use-list-todo-lists";

export const TodoPage = () => {
  const { data } = useListTodoLists();
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = useCallback(() => {
    setOpenModal(true);
  }, [setOpenModal]);

  const cards = useMemo(() => {
    if (!data?.listTodoLists) {
      return [];
    }

    return data.listTodoLists.map((todoList) => {
      return <TodoCard key={todoList.id} todoList={todoList} />;
    });
  }, [data?.listTodoLists]);

  const handleCloseModal = useCallback(() => {
    setOpenModal(false);
  }, [setOpenModal]);

  return (
    <>
      <HWrapBox>{cards}</HWrapBox>
      <StyledFab onClick={handleOpenModal} color="secondary">
        <AddIcon />
      </StyledFab>
      <TodoListModalForm open={openModal} onClose={handleCloseModal} />
    </>
  );
};
