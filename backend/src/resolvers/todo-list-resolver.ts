import {
  Args,
  Ctx,
  ID,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from "type-graphql";
import { TodoList } from "../types/todo-list-type";
import { CreateTodoListArgs, DeleteTodoListArgs } from "../args/todo-list";
import { ApolloContext } from "../server/context";
import { todoTable } from "../data-source/todo-table";

@Resolver()
export class TodoListResolver {
  @Mutation(() => TodoList!)
  async createTodoList(
    @Args() args: CreateTodoListArgs,
    @Ctx() ctx: ApolloContext
  ): Promise<TodoList> {
    return todoTable.createTodoList(args, ctx);
  }

  @Mutation(() => String!)
  async deleteTodoList(
    @Args() args: DeleteTodoListArgs,
    @Ctx() ctx: ApolloContext
  ): Promise<string> {
    await todoTable.deleteTodoList(args, ctx);

    return args.id;
  }

  @Query(() => [TodoList!]!)
  async listTodoLists(@Ctx() ctx: ApolloContext): Promise<TodoList[]> {
    return todoTable.listTodoLists(ctx);
  }

  @Subscription(() => TodoList!, {
    topics: "TODO_ADDED",
  })
  async todoListAdded() {}

  @Subscription(() => ID!, {
    topics: "TODO_LIST_REMOVED",
  })
  async todoListRemoved() {}
}
