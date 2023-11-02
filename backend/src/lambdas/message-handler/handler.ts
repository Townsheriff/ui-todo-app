import { ApiGatewayManagementApiClient } from "@aws-sdk/client-apigatewaymanagementapi";
import { APIGatewayProxyEvent } from "aws-lambda";
import {
  ackMessage,
  pongMessage,
  sendMessageToConnection,
  WsMessage,
  WsSubscribe,
} from "./utils";
import { connectionTable } from "../../data-source/connection-table";

const wsApiEndpoint = process.env.WS_API_ENDPOINT;

const client = new ApiGatewayManagementApiClient({ endpoint: wsApiEndpoint });

export const handler = async (event: APIGatewayProxyEvent) => {
  if (event.requestContext.eventType === "CONNECT") {
    return handleConnect();
  }

  if (event.requestContext.eventType === "DISCONNECT") {
    return handleDisconnect(event.requestContext.connectionId!);
  }

  if (!event.body || !event.requestContext.connectionId) {
    return;
  }
  const connectionId = event.requestContext.connectionId;
  const wsMessage = WsMessage.try(JSON.parse(event.body));

  if (!wsMessage.ok) {
    throw new Error(`Unsupported message ${event.body}`);
  }

  // https://github.com/graphql/graphql-over-http/blob/main/rfcs/GraphQLOverWebSocket.md
  switch (wsMessage.value.type) {
    case "connection_init": {
      await handleInit(connectionId);
      break;
    }
    case "ping": {
      await handlePing(connectionId);
      break;
    }
    case "subscribe": {
      await handleSubscription(connectionId, wsMessage.value);
      break;
    }
  }
  return { statusCode: 200 };
};

const handleConnect = async () => {
  return {
    headers: {
      "Sec-WebSocket-Protocol": "graphql-transport-ws",
    },
    statusCode: 200,
  };
};

const handleDisconnect = async (connId: string) => {
  await connectionTable.deleteSubscriptions(connId);

  return { statusCode: 200 };
};

const handleInit = async (connId: string) => {
  await sendMessageToConnection(client, connId, JSON.stringify(ackMessage));
};

const handlePing = async (connId: string) => {
  await sendMessageToConnection(client, connId, JSON.stringify(pongMessage));
};

const handleSubscription = async (connId: string, message: WsSubscribe) => {
  await connectionTable.putItem({
    connectionId: connId,
    id: message.id,
    topic: message.payload.operationName,
    query: message.payload.query,
  });
};
