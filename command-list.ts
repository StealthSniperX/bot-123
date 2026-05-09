import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { env } from "./env.js";
import { prisma } from "./db.js";
import { logger } from "./logger.js";
import { startBot } from "./bot/start.js";
import { startDashboard } from "./web/start.js";

const execFileAsync = promisify(execFile);

async function maybePrismaPush() {
  if (!env.PRISMA_AUTO_PUSH) return;
  const prismaBin =
    process.platform === "win32"
      ? "node_modules\\.bin\\prisma.cmd"
      : "node_modules/.bin/prisma";
  logger.warn("PRISMA_AUTO_PUSH=true -> running prisma db push");
  await execFileAsync(prismaBin, ["db", "push"], { env: process.env });
}

async function main() {
  await prisma.$connect();
  await maybePrismaPush();

  await startBot();
  await startDashboard();

  logger.info({ port: env.PORT }, "webpanel listening");
}

main().catch((err) => {
  logger.error(err, "fatal");
  process.exit(1);
});

