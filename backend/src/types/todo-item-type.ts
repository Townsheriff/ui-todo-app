import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class TodoItem {
  @Field(() => ID)
  listId!: string;

  @Field(() => ID)
  id!: string;

  @Field()
  content!: string;

  @Field()
  checked!: boolean;
}
