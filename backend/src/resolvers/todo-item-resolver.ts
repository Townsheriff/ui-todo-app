import { Args, Ctx, ID, Mutation, Resolver, Subscription } from "type-graphql";
import { TodoItem } from "../types/todo-item-type";
import {
  CreateTodoItemArgs,
  DeleteTodoItemArgs,
  UpdateTodoItemArgs,
} from "../args/todo-item";
import { ApolloContext } from "../server/context";
import { todoTable } from "../data-source/todo-table";

@Resolver()
export class TodoItemResolver {
  @Mutation(() => TodoItem!)
  async createTodoItem(
    @Args() args: CreateTodoItemArgs,
    @Ctx() ctx: ApolloContext
  ): Promise<TodoItem> {
    return todoTable.createTodoItem(args, ctx);
  }

  @Mutation(() => String!)
  async deleteTodoItem(
    @Args() args: DeleteTodoItemArgs,
    @Ctx() ctx: ApolloContext
  ): Promise<string> {
    await todoTable.deleteTodoItem(args, ctx);

    return args.id;
  }

  @Mutation(() => TodoItem!)
  async updateTodoItem(
    @Args() args: UpdateTodoItemArgs,
    @Ctx() ctx: ApolloContext
  ): Promise<TodoItem> {
    return todoTable.updateTodoItem(args, ctx);
  }

  @Subscription(() => TodoItem!, {
    topics: "TODO_UPDATED",
  })
  async todoUpdated() {}

  @Subscription(() => TodoItem!, {
    topics: "TODO_ADDED",
  })
  async todoAdded() {}

  @Subscription(() => ID!, {
    topics: "TODO_REMOVED",
  })
  async todoRemoved() {}
}
