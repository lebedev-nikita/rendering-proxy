import { z } from "zod";

export const BrowserServerResponseSchema = z.union([
  z.object({ status: z.literal("success"), html: z.string() }),
  z.object({ status: z.literal("error"), error: z.string() }),
  z.object({ status: z.literal("interval < 5 seconds") }),
]);

export type BrowserServerResponse = z.infer<typeof BrowserServerResponseSchema>;
