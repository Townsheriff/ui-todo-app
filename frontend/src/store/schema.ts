import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Mutation = {
  __typename?: 'Mutation';
  createTodoItem: TodoItem;
  createTodoList: TodoList;
  deleteTodoItem: Scalars['String']['output'];
  deleteTodoList: Scalars['String']['output'];
  updateTodoItem: TodoItem;
};


export type MutationCreateTodoItemArgs = {
  checked: Scalars['Boolean']['input'];
  content: Scalars['String']['input'];
  listId: Scalars['ID']['input'];
};


export type MutationCreateTodoListArgs = {
  title: Scalars['String']['input'];
};


export type MutationDeleteTodoItemArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteTodoListArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateTodoItemArgs = {
  checked: Scalars['Boolean']['input'];
  content: Scalars['String']['input'];
  id: Scalars['ID']['input'];
};

export type Query = {
  __typename?: 'Query';
  listTodoLists: Array<TodoList>;
};

export type Subscription = {
  __typename?: 'Subscription';
  todoAdded: TodoItem;
  todoListAdded: TodoList;
  todoListRemoved: Scalars['ID']['output'];
  todoRemoved: Scalars['ID']['output'];
  todoUpdated: TodoItem;
};

export type TodoItem = {
  __typename?: 'TodoItem';
  checked: Scalars['Boolean']['output'];
  content: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  listId: Scalars['ID']['output'];
};

export type TodoList = {
  __typename?: 'TodoList';
  id: Scalars['ID']['output'];
  items: Array<TodoItem>;
  title: Scalars['String']['output'];
};

export type CreateTodoItemMutationVariables = Exact<{
  listId: Scalars['ID']['input'];
  content: Scalars['String']['input'];
  checked: Scalars['Boolean']['input'];
}>;


export type CreateTodoItemMutation = { __typename?: 'Mutation', createTodoItem: { __typename?: 'TodoItem', listId: string, id: string, content: string, checked: boolean } };

export type CreateTodoListMutationVariables = Exact<{
  title: Scalars['String']['input'];
}>;


export type CreateTodoListMutation = { __typename?: 'Mutation', createTodoList: { __typename?: 'TodoList', id: string, title: string, items: Array<{ __typename?: 'TodoItem', listId: string, id: string, content: string, checked: boolean }> } };

export type DeleteTodoItemMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteTodoItemMutation = { __typename?: 'Mutation', deleteTodoItem: string };

export type DeleteTodoListMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteTodoListMutation = { __typename?: 'Mutation', deleteTodoList: string };

export type UpdateTodoItemMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  content: Scalars['String']['input'];
  checked: Scalars['Boolean']['input'];
}>;


export type UpdateTodoItemMutation = { __typename?: 'Mutation', updateTodoItem: { __typename?: 'TodoItem', listId: string, id: string, content: string, checked: boolean } };

export type ListTodoListsQueryVariables = Exact<{ [key: string]: never; }>;


export type ListTodoListsQuery = { __typename?: 'Query', listTodoLists: Array<{ __typename?: 'TodoList', id: string, title: string, items: Array<{ __typename?: 'TodoItem', listId: string, id: string, content: string, checked: boolean }> }> };

export type TodoAddedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type TodoAddedSubscription = { __typename?: 'Subscription', todoAdded: { __typename?: 'TodoItem', listId: string, id: string, content: string, checked: boolean } };

export type TodoListAddedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type TodoListAddedSubscription = { __typename?: 'Subscription', todoListAdded: { __typename?: 'TodoList', id: string, title: string } };

export type TodoListRemovedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type TodoListRemovedSubscription = { __typename?: 'Subscription', todoListRemoved: string };

export type TodoRemovedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type TodoRemovedSubscription = { __typename?: 'Subscription', todoRemoved: string };

export type TodoUpdatedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type TodoUpdatedSubscription = { __typename?: 'Subscription', todoUpdated: { __typename?: 'TodoItem', listId: string, id: string, content: string, checked: boolean } };


export const CreateTodoItemDocument = gql`
    mutation CreateTodoItem($listId: ID!, $content: String!, $checked: Boolean!) {
  createTodoItem(listId: $listId, content: $content, checked: $checked) {
    listId
    id
    content
    checked
  }
}
    `;
export type CreateTodoItemMutationFn = Apollo.MutationFunction<CreateTodoItemMutation, CreateTodoItemMutationVariables>;

/**
 * __useCreateTodoItemMutation__
 *
 * To run a mutation, you first call `useCreateTodoItemMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTodoItemMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTodoItemMutation, { data, loading, error }] = useCreateTodoItemMutation({
 *   variables: {
 *      listId: // value for 'listId'
 *      content: // value for 'content'
 *      checked: // value for 'checked'
 *   },
 * });
 */
export function useCreateTodoItemMutation(baseOptions?: Apollo.MutationHookOptions<CreateTodoItemMutation, CreateTodoItemMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTodoItemMutation, CreateTodoItemMutationVariables>(CreateTodoItemDocument, options);
      }
export type CreateTodoItemMutationHookResult = ReturnType<typeof useCreateTodoItemMutation>;
export type CreateTodoItemMutationResult = Apollo.MutationResult<CreateTodoItemMutation>;
export type CreateTodoItemMutationOptions = Apollo.BaseMutationOptions<CreateTodoItemMutation, CreateTodoItemMutationVariables>;
export const CreateTodoListDocument = gql`
    mutation CreateTodoList($title: String!) {
  createTodoList(title: $title) {
    id
    title
    items {
      listId
      id
      content
      checked
    }
  }
}
    `;
export type CreateTodoListMutationFn = Apollo.MutationFunction<CreateTodoListMutation, CreateTodoListMutationVariables>;

/**
 * __useCreateTodoListMutation__
 *
 * To run a mutation, you first call `useCreateTodoListMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTodoListMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTodoListMutation, { data, loading, error }] = useCreateTodoListMutation({
 *   variables: {
 *      title: // value for 'title'
 *   },
 * });
 */
export function useCreateTodoListMutation(baseOptions?: Apollo.MutationHookOptions<CreateTodoListMutation, CreateTodoListMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTodoListMutation, CreateTodoListMutationVariables>(CreateTodoListDocument, options);
      }
export type CreateTodoListMutationHookResult = ReturnType<typeof useCreateTodoListMutation>;
export type CreateTodoListMutationResult = Apollo.MutationResult<CreateTodoListMutation>;
export type CreateTodoListMutationOptions = Apollo.BaseMutationOptions<CreateTodoListMutation, CreateTodoListMutationVariables>;
export const DeleteTodoItemDocument = gql`
    mutation DeleteTodoItem($id: ID!) {
  deleteTodoItem(id: $id)
}
    `;
export type DeleteTodoItemMutationFn = Apollo.MutationFunction<DeleteTodoItemMutation, DeleteTodoItemMutationVariables>;

/**
 * __useDeleteTodoItemMutation__
 *
 * To run a mutation, you first call `useDeleteTodoItemMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTodoItemMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteTodoItemMutation, { data, loading, error }] = useDeleteTodoItemMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteTodoItemMutation(baseOptions?: Apollo.MutationHookOptions<DeleteTodoItemMutation, DeleteTodoItemMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteTodoItemMutation, DeleteTodoItemMutationVariables>(DeleteTodoItemDocument, options);
      }
export type DeleteTodoItemMutationHookResult = ReturnType<typeof useDeleteTodoItemMutation>;
export type DeleteTodoItemMutationResult = Apollo.MutationResult<DeleteTodoItemMutation>;
export type DeleteTodoItemMutationOptions = Apollo.BaseMutationOptions<DeleteTodoItemMutation, DeleteTodoItemMutationVariables>;
export const DeleteTodoListDocument = gql`
    mutation DeleteTodoList($id: ID!) {
  deleteTodoList(id: $id)
}
    `;
export type DeleteTodoListMutationFn = Apollo.MutationFunction<DeleteTodoListMutation, DeleteTodoListMutationVariables>;

/**
 * __useDeleteTodoListMutation__
 *
 * To run a mutation, you first call `useDeleteTodoListMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTodoListMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteTodoListMutation, { data, loading, error }] = useDeleteTodoListMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteTodoListMutation(baseOptions?: Apollo.MutationHookOptions<DeleteTodoListMutation, DeleteTodoListMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteTodoListMutation, DeleteTodoListMutationVariables>(DeleteTodoListDocument, options);
      }
export type DeleteTodoListMutationHookResult = ReturnType<typeof useDeleteTodoListMutation>;
export type DeleteTodoListMutationResult = Apollo.MutationResult<DeleteTodoListMutation>;
export type DeleteTodoListMutationOptions = Apollo.BaseMutationOptions<DeleteTodoListMutation, DeleteTodoListMutationVariables>;
export const UpdateTodoItemDocument = gql`
    mutation UpdateTodoItem($id: ID!, $content: String!, $checked: Boolean!) {
  updateTodoItem(id: $id, content: $content, checked: $checked) {
    listId
    id
    content
    checked
  }
}
    `;
export type UpdateTodoItemMutationFn = Apollo.MutationFunction<UpdateTodoItemMutation, UpdateTodoItemMutationVariables>;

/**
 * __useUpdateTodoItemMutation__
 *
 * To run a mutation, you first call `useUpdateTodoItemMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTodoItemMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTodoItemMutation, { data, loading, error }] = useUpdateTodoItemMutation({
 *   variables: {
 *      id: // value for 'id'
 *      content: // value for 'content'
 *      checked: // value for 'checked'
 *   },
 * });
 */
export function useUpdateTodoItemMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTodoItemMutation, UpdateTodoItemMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTodoItemMutation, UpdateTodoItemMutationVariables>(UpdateTodoItemDocument, options);
      }
export type UpdateTodoItemMutationHookResult = ReturnType<typeof useUpdateTodoItemMutation>;
export type UpdateTodoItemMutationResult = Apollo.MutationResult<UpdateTodoItemMutation>;
export type UpdateTodoItemMutationOptions = Apollo.BaseMutationOptions<UpdateTodoItemMutation, UpdateTodoItemMutationVariables>;
export const ListTodoListsDocument = gql`
    query ListTodoLists {
  listTodoLists {
    id
    title
    items {
      listId
      id
      content
      checked
    }
  }
}
    `;

/**
 * __useListTodoListsQuery__
 *
 * To run a query within a React component, call `useListTodoListsQuery` and pass it any options that fit your needs.
 * When your component renders, `useListTodoListsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListTodoListsQuery({
 *   variables: {
 *   },
 * });
 */
export function useListTodoListsQuery(baseOptions?: Apollo.QueryHookOptions<ListTodoListsQuery, ListTodoListsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListTodoListsQuery, ListTodoListsQueryVariables>(ListTodoListsDocument, options);
      }
export function useListTodoListsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListTodoListsQuery, ListTodoListsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListTodoListsQuery, ListTodoListsQueryVariables>(ListTodoListsDocument, options);
        }
export function useListTodoListsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<ListTodoListsQuery, ListTodoListsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ListTodoListsQuery, ListTodoListsQueryVariables>(ListTodoListsDocument, options);
        }
export type ListTodoListsQueryHookResult = ReturnType<typeof useListTodoListsQuery>;
export type ListTodoListsLazyQueryHookResult = ReturnType<typeof useListTodoListsLazyQuery>;
export type ListTodoListsSuspenseQueryHookResult = ReturnType<typeof useListTodoListsSuspenseQuery>;
export type ListTodoListsQueryResult = Apollo.QueryResult<ListTodoListsQuery, ListTodoListsQueryVariables>;
export const TodoAddedDocument = gql`
    subscription TodoAdded {
  todoAdded {
    listId
    id
    content
    checked
  }
}
    `;

/**
 * __useTodoAddedSubscription__
 *
 * To run a query within a React component, call `useTodoAddedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useTodoAddedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTodoAddedSubscription({
 *   variables: {
 *   },
 * });
 */
export function useTodoAddedSubscription(baseOptions?: Apollo.SubscriptionHookOptions<TodoAddedSubscription, TodoAddedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<TodoAddedSubscription, TodoAddedSubscriptionVariables>(TodoAddedDocument, options);
      }
export type TodoAddedSubscriptionHookResult = ReturnType<typeof useTodoAddedSubscription>;
export type TodoAddedSubscriptionResult = Apollo.SubscriptionResult<TodoAddedSubscription>;
export const TodoListAddedDocument = gql`
    subscription TodoListAdded {
  todoListAdded {
    id
    title
  }
}
    `;

/**
 * __useTodoListAddedSubscription__
 *
 * To run a query within a React component, call `useTodoListAddedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useTodoListAddedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTodoListAddedSubscription({
 *   variables: {
 *   },
 * });
 */
export function useTodoListAddedSubscription(baseOptions?: Apollo.SubscriptionHookOptions<TodoListAddedSubscription, TodoListAddedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<TodoListAddedSubscription, TodoListAddedSubscriptionVariables>(TodoListAddedDocument, options);
      }
export type TodoListAddedSubscriptionHookResult = ReturnType<typeof useTodoListAddedSubscription>;
export type TodoListAddedSubscriptionResult = Apollo.SubscriptionResult<TodoListAddedSubscription>;
export const TodoListRemovedDocument = gql`
    subscription TodoListRemoved {
  todoListRemoved
}
    `;

/**
 * __useTodoListRemovedSubscription__
 *
 * To run a query within a React component, call `useTodoListRemovedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useTodoListRemovedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTodoListRemovedSubscription({
 *   variables: {
 *   },
 * });
 */
export function useTodoListRemovedSubscription(baseOptions?: Apollo.SubscriptionHookOptions<TodoListRemovedSubscription, TodoListRemovedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<TodoListRemovedSubscription, TodoListRemovedSubscriptionVariables>(TodoListRemovedDocument, options);
      }
export type TodoListRemovedSubscriptionHookResult = ReturnType<typeof useTodoListRemovedSubscription>;
export type TodoListRemovedSubscriptionResult = Apollo.SubscriptionResult<TodoListRemovedSubscription>;
export const TodoRemovedDocument = gql`
    subscription TodoRemoved {
  todoRemoved
}
    `;

/**
 * __useTodoRemovedSubscription__
 *
 * To run a query within a React component, call `useTodoRemovedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useTodoRemovedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTodoRemovedSubscription({
 *   variables: {
 *   },
 * });
 */
export function useTodoRemovedSubscription(baseOptions?: Apollo.SubscriptionHookOptions<TodoRemovedSubscription, TodoRemovedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<TodoRemovedSubscription, TodoRemovedSubscriptionVariables>(TodoRemovedDocument, options);
      }
export type TodoRemovedSubscriptionHookResult = ReturnType<typeof useTodoRemovedSubscription>;
export type TodoRemovedSubscriptionResult = Apollo.SubscriptionResult<TodoRemovedSubscription>;
export const TodoUpdatedDocument = gql`
    subscription TodoUpdated {
  todoUpdated {
    listId
    id
    content
    checked
  }
}
    `;

/**
 * __useTodoUpdatedSubscription__
 *
 * To run a query within a React component, call `useTodoUpdatedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useTodoUpdatedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTodoUpdatedSubscription({
 *   variables: {
 *   },
 * });
 */
export function useTodoUpdatedSubscription(baseOptions?: Apollo.SubscriptionHookOptions<TodoUpdatedSubscription, TodoUpdatedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<TodoUpdatedSubscription, TodoUpdatedSubscriptionVariables>(TodoUpdatedDocument, options);
      }
export type TodoUpdatedSubscriptionHookResult = ReturnType<typeof useTodoUpdatedSubscription>;
export type TodoUpdatedSubscriptionResult = Apollo.SubscriptionResult<TodoUpdatedSubscription>;