generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model GuildConfig {
  guildId    String   @id
  data       Json
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

model MemberXp {
  guildId   String
  userId    String
  xp        Int      @default(0)
  level     Int      @default(0)
  updatedAt DateTime @updatedAt

  @@id([guildId, userId])
  @@index([guildId, xp])
}

