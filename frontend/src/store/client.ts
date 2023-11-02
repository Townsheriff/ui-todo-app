import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  from,
  split,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";

const graphqlUrl = process.env.GRAPHQL_URL;
const graphqlWs = process.env.GRAPHQL_WS!;

export const createApolloClient = () => {
  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.forEach(({ message, locations, path }) =>
        console.log(
          `[GraphQL error]: Message: ${JSON.stringify(
            message
          )}, Location: ${JSON.stringify(locations)}, Path: ${path}`
        )
      );
    if (networkError) {
      console.log(`[Network error]: ${networkError}`);
    }
  });

  const httpLink = new HttpLink({
    uri: graphqlUrl,
  });

  const wsLink = new GraphQLWsLink(
    createClient({
      url: graphqlWs,
      keepAlive: 10_000,
    })
  );

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "subscription"
      );
    },
    wsLink,
    httpLink
  );

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: from([errorLink, splitLink]),
  });

  return client;
};
