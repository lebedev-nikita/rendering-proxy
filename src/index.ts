import express from "express";
import { z } from "zod";

import { BrowserServerResponse as ServerResponse } from "./lib/api.js";

import browser from "./browser.js";
import { env } from "./env.js";

let canRun = true;

express()
  .use(express.json())
  .get("/canRun", (req, res) => res.json({ canRun }))
  .post("/render", async (req, res) => {
    if (!canRun) {
      return res.json({
        status: "interval < 5 seconds",
      } satisfies ServerResponse);
    }

    canRun = false;
    setTimeout(() => (canRun = true), 5000);

    try {
      const url = z.string().url().parse(req.body.url);

      const html = await browser.loadHtml(url);
      return res.json({ status: "success", html } satisfies ServerResponse);
    } catch (error) {
      if (error instanceof Error) {
        return res.json({
          status: "error",
          error: error.message,
        } satisfies ServerResponse);
      }
    }
  })
  .listen(env.SERVER_PORT, () => {
    console.log(`http://localhost:${env.SERVER_PORT}`);
  });
