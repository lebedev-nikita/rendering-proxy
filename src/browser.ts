import { DEFAULT_INTERCEPT_RESOLUTION_PRIORITY as interceptResolutionPriority } from "puppeteer";
import p from "puppeteer-extra";
import AdblockerPlugin from "puppeteer-extra-plugin-adblocker";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

import { getLogger } from "./lib/logger.js";

const puppeteer = p.default;

puppeteer.use(StealthPlugin());
puppeteer.use(AdblockerPlugin.default({ interceptResolutionPriority }));

const browser = await puppeteer.launch({
  headless: "new",
  timeout: 180e3,
  ignoreHTTPSErrors: true,
  args: ["--no-sandbox"],
});

process.on("uncaughtException", async (error) => {
  await browser.close();
  getLogger("uncaught exception").error(error);
});

process.on("beforeExit", async () => {
  await browser.close();
});

export default {
  async loadHtml(url: string) {
    const page = await browser.newPage();

    try {
      await page.goto(url, { waitUntil: "domcontentloaded" });
      const html = await page.evaluate(
        () => window.document.documentElement.outerHTML,
      );
      return html;
    } finally {
      await page.close();
    }
  },
};
