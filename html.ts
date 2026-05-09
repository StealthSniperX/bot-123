import {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} from "discord.js";
import type { SlashCommand } from "../types.js";

export const verifyCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("verify")
    .setDescription("Verification")
    .addSubcommand((s) => s.setName("send").setDescription("Sende Verify-Button")),
  async execute(interaction) {
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("verify:click")
        .setLabel("Verifizieren")
        .setStyle(ButtonStyle.Success)
    );
    await interaction.reply({ content: "Klicke zum Verifizieren:", components: [row] });
  }
};

