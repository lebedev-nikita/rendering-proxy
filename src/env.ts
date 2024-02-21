import { z } from "zod";

import { getEnv } from "./lib/utils.js";

export const env = getEnv(
  z.object({
    SERVER_PORT: z.coerce.number(),
  }),
);
