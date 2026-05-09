import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import type { SlashCommand } from "../types.js";
import { prisma } from "../../db.js";
import type { MemberXp } from "@prisma/client";

export const levelCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("level")
    .setDescription("Leveling")
    .addSubcommand((s) => s.setName("me").setDescription("Dein Level"))
    .addSubcommand((s) => s.setName("top").setDescription("Top 10")),
  async execute(interaction) {
    if (!interaction.guildId) return interaction.reply({ content: "Nur im Server.", ephemeral: true });
    const sub = interaction.options.getSubcommand(true);
    if (sub === "me") {
      const row = await prisma.memberXp.findUnique({
        where: { guildId_userId: { guildId: interaction.guildId, userId: interaction.user.id } }
      });
      const xp = row?.xp ?? 0;
      const level = row?.level ?? 0;
      const embed = new EmbedBuilder()
        .setTitle("Dein Level")
        .setColor(0xfee75c)
        .addFields(
          { name: "Level", value: String(level), inline: true },
          { name: "XP", value: String(xp), inline: true }
        );
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
    const top = await prisma.memberXp.findMany({
      where: { guildId: interaction.guildId },
      orderBy: [{ level: "desc" }, { xp: "desc" }],
      take: 10
    });
    const lines = (top as MemberXp[]).map(
      (r: MemberXp, i: number) => `#${i + 1} <@${r.userId}> — L${r.level} (${r.xp} XP)`
    );
    const embed = new EmbedBuilder().setTitle("Top 10").setColor(0xfee75c).setDescription(lines.join("\n") || "Noch niemand.");
    return interaction.reply({ embeds: [embed] });
  }
};
