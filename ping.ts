import { SlashCommandBuilder, PermissionFlagsBits, ChannelType } from "discord.js";
import type { SlashCommand } from "../types.js";
import { getGuildConfig, setGuildConfig } from "../../guild-config.js";

export const jtcCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("jtc")
    .setDescription("Join-To-Create konfigurieren")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand((s) =>
      s
        .setName("sethub")
        .setDescription("Hub-Voice-Channel setzen")
        .addChannelOption((o) =>
          o
            .setName("channel")
            .setDescription("Voice Channel")
            .addChannelTypes(ChannelType.GuildVoice)
            .setRequired(true)
        )
    )
    .addSubcommand((s) => s.setName("status").setDescription("Status anzeigen")),
  async execute(interaction) {
    if (!interaction.guildId) return interaction.reply({ content: "Nur im Server.", ephemeral: true });
    const cfg = await getGuildConfig(interaction.guildId);
    const sub = interaction.options.getSubcommand(true);
    if (sub === "status") {
      return interaction.reply({
        content: `JTC: ${cfg.modules.joinToCreate ? "AN" : "AUS"} | Hub: ${
          cfg.channels.joinToCreateHubChannelId
            ? `<#${cfg.channels.joinToCreateHubChannelId}>`
            : "nicht gesetzt"
        }`,
        ephemeral: true
      });
    }
    const ch = interaction.options.getChannel("channel", true);
    cfg.channels.joinToCreateHubChannelId = ch.id;
    cfg.modules.joinToCreate = true;
    await setGuildConfig(interaction.guildId, cfg);
    await interaction.reply({ content: "✅ Hub gesetzt.", ephemeral: true });
  }
};

