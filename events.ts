import { SlashCommandBuilder, PermissionFlagsBits, ChannelType } from "discord.js";
import type { SlashCommand } from "../types.js";
import { getGuildConfig, setGuildConfig } from "../../guild-config.js";

export const serverstatsCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("serverstats")
    .setDescription("ServerStats Channel")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand((s) =>
      s
        .setName("setup")
        .setDescription("Stats Channel konfigurieren")
        .addChannelOption((o) =>
          o
            .setName("channel")
            .setDescription("Voice Channel (nur Name) oder Text Channel")
            .addChannelTypes(ChannelType.GuildVoice, ChannelType.GuildText)
            .setRequired(true)
        )
        .addIntegerOption((o) =>
          o.setName("ziel").setDescription("Member-Ziel (optional)").setRequired(false)
        )
        .addStringOption((o) =>
          o
            .setName("template")
            .setDescription("z.B. Members: {members}/{goal} | Bots: {bots} | Boosts: {boosts}")
            .setRequired(false)
        )
    )
    .addSubcommand((s) => s.setName("status").setDescription("Status anzeigen")),
  async execute(interaction) {
    if (!interaction.guildId) return interaction.reply({ content: "Nur im Server.", ephemeral: true });
    const cfg = await getGuildConfig(interaction.guildId);
    const sub = interaction.options.getSubcommand(true);
    if (sub === "status") {
      return interaction.reply({
        content: `ServerStats: ${cfg.modules.serverStats ? "AN" : "AUS"} | Channel: ${
          cfg.serverStats?.channelId ? `<#${cfg.serverStats.channelId}>` : "nicht gesetzt"
        }`,
        ephemeral: true
      });
    }
    const ch = interaction.options.getChannel("channel", true);
    const goal = interaction.options.getInteger("ziel") ?? undefined;
    const template =
      interaction.options.getString("template") ??
      "Members: {members}/{goal} | Bots: {bots} | Boosts: {boosts}";
    cfg.serverStats ??= {};
    cfg.serverStats.channelId = ch.id;
    cfg.serverStats.goalMembers = goal;
    cfg.serverStats.template = template;
    cfg.modules.serverStats = true;
    await setGuildConfig(interaction.guildId, cfg);
    await interaction.reply({ content: "✅ ServerStats gespeichert.", ephemeral: true });
  }
};

