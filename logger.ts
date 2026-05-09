import { prisma } from "./db.js";

export type GuildConfigData = {
  modules: {
    welcome: boolean;
    autoRole: boolean;
    logging: boolean;
    moderation: boolean;
    leveling: boolean;
    joinToCreate: boolean;
    reactionRoles: boolean;
    tickets: boolean;
    verification: boolean;
    serverStats: boolean;
    antiRaid: boolean;
  };
  channels: {
    welcomeChannelId?: string;
    logChannelId?: string;
    levelUpChannelId?: string;
    joinToCreateHubChannelId?: string;
    serverStatsChannelId?: string;
  };
  roles: {
    autoRoleId?: string;
    verifiedRoleId?: string;
  };
  moderation: {
    bannedWords: string[];
    deleteDiscordInvites: boolean;
  };
  leveling: {
    xpPerMessage: number;
    cooldownSeconds: number;
  };
  antiRaid: {
    maxJoinsPerMinute: number;
  };
  reactionRoleMenus?: Record<
    string,
    { title: string; placeholder: string; options: Array<{ label: string; roleId: string; value: string }> }
  >;
  ticketPanels?: Array<{
    id: string;
    title: string;
    description: string;
    buttonLabel: string;
  }>;
  tickets?: {
    categoryId?: string;
    supportRoleId?: string;
  };
  serverStats?: {
    channelId?: string;
    template?: string;
    goalMembers?: number;
  };
};

export const defaultGuildConfig = (): GuildConfigData => ({
  modules: {
    welcome: true,
    autoRole: false,
    logging: true,
    moderation: true,
    leveling: true,
    joinToCreate: false,
    reactionRoles: false,
    tickets: false,
    verification: false,
    serverStats: false,
    antiRaid: true
  },
  channels: {},
  roles: {},
  moderation: {
    bannedWords: [],
    deleteDiscordInvites: true
  },
  leveling: {
    xpPerMessage: 10,
    cooldownSeconds: 45
  },
  antiRaid: {
    maxJoinsPerMinute: 8
  },
  reactionRoleMenus: {},
  ticketPanels: [],
  tickets: {},
  serverStats: {}
});

export async function getGuildConfig(guildId: string): Promise<GuildConfigData> {
  const row = await prisma.guildConfig.findUnique({ where: { guildId } });
  if (!row) {
    const data = defaultGuildConfig();
    await prisma.guildConfig.create({ data: { guildId, data } });
    return data;
  }
  return row.data as GuildConfigData;
}

export async function setGuildConfig(guildId: string, data: GuildConfigData) {
  await prisma.guildConfig.upsert({
    where: { guildId },
    create: { guildId, data },
    update: { data }
  });
}
