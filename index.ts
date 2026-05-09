import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  DISCORD_TOKEN: z.string().min(1),
  DISCORD_APP_ID: z.string().min(1),

  OWNER_DISCORD_ID: z.string().min(1),
  GUILD_ID: z.string().optional(),

  DATABASE_URL: z.string().min(1),

  PORT: z.coerce.number().default(3000),
  SESSION_SECRET: z.string().min(10),
  PUBLIC_BASE_URL: z.string().url(),

  OAUTH_CLIENT_ID: z.string().min(1),
  OAUTH_CLIENT_SECRET: z.string().min(1),
  OAUTH_REDIRECT_URI: z.string().url(),

  PRISMA_AUTO_PUSH: z
    .enum(["true", "false"])
    .optional()
    .transform((v) => v === "true")
});

export const env = envSchema.parse(process.env);

