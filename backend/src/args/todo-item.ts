import { ArgsType, Field, ID } from "type-graphql";

@ArgsType()
export class CreateTodoItemArgs {
  @Field(() => ID)
  listId!: string;

  @Field()
  content?: string;

  @Field()
  checked?: boolean;
}

@ArgsType()
export class DeleteTodoItemArgs {
  @Field(() => ID)
  id!: string;
}

@ArgsType()
export class UpdateTodoItemArgs {
  @Field(() => ID)
  id!: string;

  @Field()
  content?: string;

  @Field()
  checked?: boolean;
}
