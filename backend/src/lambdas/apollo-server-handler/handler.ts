import {
  startServerAndCreateLambdaHandler,
  handlers,
  LambdaHandler,
} from "@as-integrations/aws-lambda";
import { createApolloServer } from "../../server/apollo-server";
import { createContext } from "../../server/context";
import {
  APIGatewayProxyStructuredResultV2,
  Context,
  Callback,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";

let lambdaHandler: LambdaHandler<
  handlers.RequestHandler<APIGatewayProxyEvent, APIGatewayProxyResult>
>;

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback<APIGatewayProxyStructuredResultV2>
) => {
  if (!lambdaHandler) {
    const server = await createApolloServer();
    const apolloContext = createContext();

    lambdaHandler = startServerAndCreateLambdaHandler(
      server,
      handlers.createAPIGatewayProxyEventRequestHandler(),
      {
        context: apolloContext,
      }
    );
  }

  return lambdaHandler(event, context, callback);
};
