import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import type { SlashCommand } from "../types.js";

export const pollCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("poll")
    .setDescription("Abstimmung erstellen")
    .addSubcommand((s) =>
      s
        .setName("create")
        .setDescription("Erstelle eine Poll (👍/👎)")
        .addStringOption((o) => o.setName("frage").setDescription("Frage").setRequired(true))
    ),
  async execute(interaction) {
    const q = interaction.options.getString("frage", true);
    const embed = new EmbedBuilder().setTitle("📊 Umfrage").setDescription(q).setColor(0x5865f2).setFooter({ text: `von ${interaction.user.tag}` });
    await interaction.reply({ embeds: [embed] });
    const msg = (await interaction.fetchReply()) as any;
    await msg.react("👍");
    await msg.react("👎");
  }
};
