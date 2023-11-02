import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from "@aws-sdk/client-apigatewaymanagementapi";
import * as v from "@badrap/valita";

export const WsConnectionInit = v.object({
  type: v.literal("connection_init"),
});

export type WsConnectionInit = v.Infer<typeof WsConnectionInit>;

export const WsPingInit = v.object({
  type: v.literal("ping"),
});

export type WsPingInit = v.Infer<typeof WsPingInit>;

export const WsPongInit = v.object({
  type: v.literal("pong"),
});

export type WsPongInit = v.Infer<typeof WsPongInit>;

export const WsSubscribe = v.object({
  type: v.literal("subscribe"),
  payload: v.object({
    query: v.string(),
    operationName: v.string(),
    variables: v.record(),
    extensions: v.unknown(),
  }),
  id: v.string(),
});
export type WsSubscribe = v.Infer<typeof WsSubscribe>;

export const WsMessage = v.union(
  WsConnectionInit,
  WsPingInit,
  WsPongInit,
  WsSubscribe
);
export type WsMessage = v.Infer<typeof WsMessage>;

export const pongMessage = {
  type: "pong",
};

export const pingMessage = {
  type: "ping",
};

export const ackMessage = {
  type: "connection_ack",
  payload: null,
};

export const sendMessageToConnection = async (
  client: ApiGatewayManagementApiClient,
  connectionId: string,
  message: string
) => {
  await client.send(
    new PostToConnectionCommand({
      ConnectionId: connectionId,
      Data: message,
    })
  );
};
