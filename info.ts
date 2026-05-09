import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChannelType } from "discord.js";
import type { SlashCommand } from "../types.js";

export const embedCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("embed")
    .setDescription("Embed Builder (einfach)")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addSubcommand((s) =>
      s
        .setName("send")
        .setDescription("Sende ein Embed")
        .addStringOption((o) => o.setName("titel").setDescription("Titel").setRequired(true))
        .addStringOption((o) => o.setName("text").setDescription("Beschreibung").setRequired(true))
        .addStringOption((o) => o.setName("farbe").setDescription("Hex, z.B. #5865F2").setRequired(false))
        .addChannelOption((o) =>
          o
            .setName("channel")
            .setDescription("Ziel-Channel (default: aktueller)")
            .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
            .setRequired(false)
        )
    ),
  async execute(interaction) {
    const title = interaction.options.getString("titel", true);
    const text = interaction.options.getString("text", true);
    const colorStr = interaction.options.getString("farbe") ?? "#5865F2";
    const channel = interaction.options.getChannel("channel") ?? interaction.channel;

    const color = Number.parseInt(colorStr.replace("#", ""), 16);
    const embed = new EmbedBuilder().setTitle(title).setDescription(text).setColor(Number.isFinite(color) ? color : 0x5865f2);

    if (!channel || !("send" in channel)) {
      return interaction.reply({ content: "Channel ungültig.", ephemeral: true });
    }
    await (channel as any).send({ embeds: [embed] });
    await interaction.reply({ content: "✅ Gesendet.", ephemeral: true });
  }
};
