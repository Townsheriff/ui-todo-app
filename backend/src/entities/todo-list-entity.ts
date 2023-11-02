import * as v from "@badrap/valita";

export const TodoListEntity = v.object({
  pk: v.literal("TODO_LIST"),
  id: v.string(),
  title: v.string(),
  insertOrder: v.string(),
});

export type TodoListEntity = v.Infer<typeof TodoListEntity>;
