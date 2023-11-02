import * as v from "@badrap/valita";

export const TodoItemEntity = v.object({
  pk: v.literal("TODO_LIST"),
  id: v.string(),
  checked: v.boolean(),
  content: v.string(),
  insertOrder: v.string(),
  listId: v.string(),
});

export type TodoItemEntity = v.Infer<typeof TodoItemEntity>;
