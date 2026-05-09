import { SlashCommandBuilder } from "discord.js";
import type { SlashCommand } from "../types.js";
import { getGuildConfig } from "../../guild-config.js";

export const welcomeCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("welcome")
    .setDescription("Welcome-Modul Status"),
  async execute(interaction) {
    if (!interaction.guildId) return interaction.reply({ content: "Nur im Server.", ephemeral: true });
    const cfg = await getGuildConfig(interaction.guildId);
    await interaction.reply({
      content: `Welcome: ${cfg.modules.welcome ? "AN" : "AUS"} | Channel: ${
        cfg.channels.welcomeChannelId ? `<#${cfg.channels.welcomeChannelId}>` : "nicht gesetzt"
      }`,
      ephemeral: true
    });
  }
};

