import { SlashCommandBuilder } from "discord.js";
import type { SlashCommand } from "../types.js";

export const pingCommand: SlashCommand = {
  data: new SlashCommandBuilder().setName("ping").setDescription("Bot-Latenz anzeigen"),
  async execute(interaction) {
    await interaction.reply({
      content: `Pong! WS: ${interaction.client.ws.ping}ms`,
      ephemeral: true
    });
  }
};

