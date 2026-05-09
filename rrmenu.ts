import { SlashCommandBuilder } from "discord.js";
import type { SlashCommand } from "../types.js";
import { getGuildConfig } from "../../guild-config.js";

export const loggingCommand: SlashCommand = {
  data: new SlashCommandBuilder().setName("logging").setDescription("Logging Status"),
  async execute(interaction) {
    if (!interaction.guildId) return interaction.reply({ content: "Nur im Server.", ephemeral: true });
    const cfg = await getGuildConfig(interaction.guildId);
    await interaction.reply({
      content: `Logging: ${cfg.modules.logging ? "AN" : "AUS"} | Channel: ${
        cfg.channels.logChannelId ? `<#${cfg.channels.logChannelId}>` : "nicht gesetzt"
      }`,
      ephemeral: true
    });
  }
};

