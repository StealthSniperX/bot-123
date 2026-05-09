import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import type { SlashCommand } from "../types.js";

export const infoCommand: SlashCommand = {
  data: new SlashCommandBuilder().setName("info").setDescription("Server/Bot-Infos"),
  async execute(interaction) {
    const guild = interaction.guild;
    const embed = new EmbedBuilder()
      .setTitle("Info")
      .setColor(0x57f287)
      .addFields(
        { name: "Bot", value: interaction.client.user?.tag ?? "?", inline: true },
        { name: "Server", value: guild?.name ?? "DM", inline: true }
      );
    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};

