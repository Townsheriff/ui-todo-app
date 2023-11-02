import * as v from "@badrap/valita";

export const ConnectionEntity = v.object({
  connectionId: v.string(),
  topic: v.string(),
  id: v.string(),
  query: v.string(),
});

export type ConnectionEntity = v.Infer<typeof ConnectionEntity>;
