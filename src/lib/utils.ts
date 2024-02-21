import fs from "node:fs/promises";
import path from "node:path";
import { ZodSchema } from "zod";

import { getLogger } from "./logger.js";

export function getEnv<T>(schema: ZodSchema<T, any, any>) {
  const result = schema.safeParse(process.env);

  if (!result.success) {
    getLogger("env error").error(JSON.stringify(result.error.issues, null, 2));
    process.exit(1);
  }

  return result.data;
}

export async function logToFile(fileName: string, str: string) {
  const filePath = path.resolve(__dirname, "..", fileName);
  await fs.writeFile(filePath, str);
}

export async function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

const tagsToReplace = new Map([
  ["&", "&amp;"],
  ["<", "&lt;"],
  [">", "&gt;"],
]);

export function escapeHtmlEntities(str: string) {
  return str.replace(/[&<>]/g, (tag) => tagsToReplace.get(tag) ?? tag);
}

export function single(fn: () => void | Promise<void>) {
  let isRunning = false;

  return async () => {
    try {
      isRunning = true;
      await fn();
    } finally {
      isRunning = false;
    }
  };
}

type CatchOutput<T> =
  | { status: "success"; data: T }
  | { status: "error"; error: Error };

export function catch_<TArgs extends unknown[], TOutput>(
  fn: (...args: TArgs) => Promise<TOutput>,
): (...args: TArgs) => Promise<CatchOutput<TOutput>>;

export function catch_<TArgs extends unknown[], TOutput>(
  fn: (...args: TArgs) => TOutput,
): (...args: TArgs) => CatchOutput<TOutput>;

export function catch_(fn: any) {
  return (...args: unknown[]) => {
    try {
      const data = fn(...args);
      return data instanceof Promise
        ? data
            .then((data) => ({ status: "success", data }))
            .catch((error) => ({ status: "error", error }))
        : { status: "success", data };
    } catch (error) {
      return { status: "error", error };
    }
  };
}
