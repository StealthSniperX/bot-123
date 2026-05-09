import {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
  Events,
  InteractionType
} from "discord.js";
import { env } from "../env.js";
import { logger } from "../logger.js";
import type { SlashCommand } from "./types.js";
import { allCommands } from "./command-list.js";
import { registerEventHandlers } from "./system/events.js";
import { getGuildConfig } from "../guild-config.js";
import { ChannelType } from "discord.js";

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

const commands: SlashCommand[] = allCommands;

export const commandMap = new Collection<string, SlashCommand>();
for (const c of commands) commandMap.set(c.data.name, c);

export async function startBot() {
  registerEventHandlers(client);

  client.once(Events.ClientReady, async () => {
    setInterval(async () => {
      try {
        const guilds = await client.guilds.fetch();
        for (const g of guilds.values()) {
          if (env.GUILD_ID && g.id !== env.GUILD_ID) continue;
          const cfg = await getGuildConfig(g.id);
          if (!cfg.modules.serverStats) continue;
          const channelId = cfg.serverStats?.channelId;
          if (!channelId) continue;
          const guild = await client.guilds.fetch(g.id);
          const channel = await guild.channels.fetch(channelId).catch(() => null);
          if (!channel) continue;

          const members = guild.memberCount;
          const bots = guild.members.cache.filter((m) => m.user.bot).size;
          const boosts = guild.premiumSubscriptionCount ?? 0;
          const goal = cfg.serverStats?.goalMembers ?? 0;
          const tpl = cfg.serverStats?.template ?? "Members: {members}/{goal} | Bots: {bots} | Boosts: {boosts}";
          const name = tpl
            .replaceAll("{members}", String(members))
            .replaceAll("{bots}", String(bots))
            .replaceAll("{boosts}", String(boosts))
            .replaceAll("{goal}", goal ? String(goal) : "—");

          if (channel.type === ChannelType.GuildVoice || channel.type === ChannelType.GuildText) {
            if (channel.name !== name) await channel.setName(name).catch(() => null);
          }
        }
      } catch {
        // ignore
      }
    }, 60_000);
  });

  client.on(Events.InteractionCreate, async (interaction) => {
    try {
      if (interaction.type !== InteractionType.ApplicationCommand) return;
      if (!interaction.isChatInputCommand()) return;
      if (env.GUILD_ID && interaction.guildId !== env.GUILD_ID) {
        return interaction.reply({ content: "Dieser Bot ist auf einen Server gelockt.", ephemeral: true });
      }
      const cmd = commandMap.get(interaction.commandName);
      if (!cmd) return interaction.reply({ content: "Unbekannter Befehl.", ephemeral: true });
      await cmd.execute(interaction, { client });
    } catch (err) {
      logger.error(err, "interaction error");
      if (interaction.isRepliable()) {
        try {
          await interaction.reply({ content: "Fehler beim Ausführen.", ephemeral: true });
        } catch {
          // ignore
        }
      }
    }
  });

  await client.login(env.DISCORD_TOKEN);
  logger.info({ user: client.user?.tag }, "bot logged in");
}
