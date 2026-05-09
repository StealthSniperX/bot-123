import pino from "pino";

export const logger = pino(
  {
    level: process.env.LOG_LEVEL ?? "info",
    base: undefined
  },
  process.env.NODE_ENV === "production"
    ? undefined
    : (await import("pino-pretty")).default({ colorize: true })
);

