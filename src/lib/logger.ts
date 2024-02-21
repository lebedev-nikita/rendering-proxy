import log4js from "log4js";

export function getLogger(name: string) {
  const _logger = log4js.getLogger(name);
  if (process.env.LOG_LEVEL) {
    _logger.level = process.env.LOG_LEVEL;
  }

  return {
    info: (...vals) => _logger.info(...vals),
    warn: (...vals) => _logger.warn(...vals),
    error: (...vals) => _logger.error(...vals),
    debug: (...vals) => _logger.debug(...vals),
  } satisfies Record<string, (...vals: [unknown, ...unknown[]]) => unknown>;
}
