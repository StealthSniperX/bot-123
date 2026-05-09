import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from "discord.js";
import type { SlashCommand } from "../types.js";

type Giveaway = {
  messageId: string;
  channelId: string;
  guildId: string;
  endsAt: number;
  prize: string;
  timeout: NodeJS.Timeout;
};

const giveaways = new Map<string, Giveaway>(); // messageId -> giveaway

async function endGiveaway(client: any, g: Giveaway) {
  const channel = await client.channels.fetch(g.channelId).catch(() => null);
  if (!channel || !("messages" in channel)) return;
  const msg = await channel.messages.fetch(g.messageId).catch(() => null);
  if (!msg) return;
  const reaction = msg.reactions.cache.get("🎉") ?? (await msg.reactions.fetch("🎉").catch(() => null));
  const users = reaction ? await reaction.users.fetch().catch(() => null) : null;
  const pool = users ? users.filter((u: any) => !u.bot).map((u: any) => u.id) : [];
  const winner = pool.length ? pool[Math.floor(Math.random() * pool.length)] : null;
  await channel.send(winner ? `🎉 Gewinner: <@${winner}> — **${g.prize}**` : `❌ Keine Teilnehmer — **${g.prize}**`);
  giveaways.delete(g.messageId);
}

export const giveawayCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("giveaway")
    .setDescription("Giveaway (einfach, ohne Persistenz)")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand((s) =>
      s
        .setName("start")
        .setDescription("Startet ein Giveaway")
        .addIntegerOption((o) => o.setName("minuten").setDescription("Dauer in Minuten").setRequired(true))
        .addStringOption((o) => o.setName("preis").setDescription("Preis").setRequired(true))
    )
    .addSubcommand((s) =>
      s
        .setName("end")
        .setDescription("Beendet ein Giveaway")
        .addStringOption((o) => o.setName("message_id").setDescription("Message ID").setRequired(true))
    ),
  async execute(interaction) {
    const sub = interaction.options.getSubcommand(true);
    if (sub === "start") {
      const minutes = interaction.options.getInteger("minuten", true);
      const prize = interaction.options.getString("preis", true);
      const endsAt = Date.now() + minutes * 60_000;
      const embed = new EmbedBuilder()
        .setTitle("🎉 Giveaway")
        .setDescription(`Preis: **${prize}**\nReagiere mit 🎉 um teilzunehmen.\nEndet: <t:${Math.floor(endsAt / 1000)}:R>`)
        .setColor(0xf47fff);
      await interaction.reply({ embeds: [embed] });
      const msg = (await interaction.fetchReply()) as any;
      await msg.react("🎉");

      const timeout = setTimeout(() => endGiveaway(interaction.client, giveaways.get(msg.id)!), minutes * 60_000);
      giveaways.set(msg.id, {
        messageId: msg.id,
        channelId: interaction.channelId,
        guildId: interaction.guildId!,
        endsAt,
        prize,
        timeout
      });
      return;
    }
    const messageId = interaction.options.getString("message_id", true);
    const g = giveaways.get(messageId);
    if (!g) return interaction.reply({ content: "Nicht gefunden (oder Bot neu gestartet).", ephemeral: true });
    clearTimeout(g.timeout);
    await interaction.reply({ content: "Beende…", ephemeral: true });
    await endGiveaway(interaction.client, g);
  }
};
