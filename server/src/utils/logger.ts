import fs from "node:fs";
import path from "node:path";

type LogLevel = "debug" | "info" | "warn" | "error";

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

const configuredLevel = (process.env.LOG_LEVEL || "info").toLowerCase() as LogLevel;
const activeLevel: LogLevel = configuredLevel in LEVEL_PRIORITY ? configuredLevel : "info";
const logDirectory = path.join(process.cwd(), "logs");
const logFilePath = path.join(logDirectory, "app.log");

if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

function shouldLog(level: LogLevel) {
  return LEVEL_PRIORITY[level] >= LEVEL_PRIORITY[activeLevel];
}

function toPayload(value: unknown) {
  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message,
      stack: value.stack,
    };
  }
  return value;
}

function log(level: LogLevel, message: string, meta?: unknown) {
  if (!shouldLog(level)) return;

  const timestamp = new Date().toISOString();
  const base = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  const line =
    meta === undefined
      ? `${base}\n`
      : `${base} ${JSON.stringify(toPayload(meta))}\n`;

  // Keep console logs for local DX and write the same line to a file.
  if (meta === undefined) console.log(base);
  else console.log(base, JSON.stringify(toPayload(meta)));

  fs.appendFile(logFilePath, line, (error) => {
    if (error) {
      console.error("[LOGGER_WRITE_ERROR]", error);
    }
  });
}

export const logger = {
  debug: (message: string, meta?: unknown) => log("debug", message, meta),
  info: (message: string, meta?: unknown) => log("info", message, meta),
  warn: (message: string, meta?: unknown) => log("warn", message, meta),
  error: (message: string, meta?: unknown) => log("error", message, meta),
};
