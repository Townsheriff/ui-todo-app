import { Field, ID, ObjectType } from "type-graphql";
import { TodoItem } from "./todo-item-type";

@ObjectType()
export class TodoList {
  @Field(() => ID)
  id!: string;

  @Field()
  title!: string;

  @Field(() => [TodoItem!]!)
  items!: TodoItem[];
}
