import { ArgsType, Field, ID } from "type-graphql";

@ArgsType()
export class CreateTodoListArgs {
  @Field()
  title?: string;
}

@ArgsType()
export class DeleteTodoListArgs {
  @Field(() => ID)
  id!: string;
}
