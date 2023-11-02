import { DynamoDBStreamEvent } from "aws-lambda";
import { connectionTable } from "../../data-source/connection-table";
import { createPayloadBuckets, sendMessageToConnection } from "./utils";

export const handler = async (event: DynamoDBStreamEvent) => {
  const buckets = createPayloadBuckets(event.Records);

  for (const [topic, payloads] of Object.entries(buckets)) {
    const subscriptions = await connectionTable.getAllSubscriptions(topic);

    const messages = subscriptions.flatMap((sub) => {
      return payloads.map((payload) => {
        return {
          connectionId: sub.connectionId,
          payload: {
            type: "next",
            id: sub.id,
            payload: {
              query: sub.query,
              data: payload.data,
            },
          },
        };
      });
    });

    const promises = messages.map((message) =>
      sendMessageToConnection(message.connectionId, message.payload)
    );

    const results = await Promise.allSettled(promises);

    const failed = results.reduce<string[]>((acc, curr, index) => {
      if (curr.status === "rejected") {
        acc.push(messages[index].connectionId);
      }

      return acc;
    }, []);

    const deletePromises = failed.map((conn) => {
      return connectionTable.deleteSubscriptions(conn);
    });

    await Promise.allSettled(deletePromises);
  }
};
