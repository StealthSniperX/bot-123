import { SlashCommandBuilder } from "discord.js";
import type { SlashCommand } from "../types.js";
import { getGuildConfig } from "../../guild-config.js";

export const autoroleCommand: SlashCommand = {
  data: new SlashCommandBuilder().setName("autorole").setDescription("Auto-Role Status"),
  async execute(interaction) {
    if (!interaction.guildId) return interaction.reply({ content: "Nur im Server.", ephemeral: true });
    const cfg = await getGuildConfig(interaction.guildId);
    await interaction.reply({
      content: `Auto-Role: ${cfg.modules.autoRole ? "AN" : "AUS"} | Rolle: ${
        cfg.roles.autoRoleId ? `<@&${cfg.roles.autoRoleId}>` : "nicht gesetzt"
      }`,
      ephemeral: true
    });
  }
};

