import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder
} from "discord.js";
import type { SlashCommand } from "../types.js";

export const helpCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Liste alle Befehle auf oder suche nach einem Befehl")
    .addStringOption((o) =>
      o.setName("suche").setDescription("z.B. ticket, level, mod").setRequired(false)
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    const q = interaction.options.getString("suche")?.toLowerCase() ?? "";

    const groups: Array<{ title: string; items: string[] }> = [
      { title: "Community", items: ["/ping", "/help", "/info"] },
      { title: "Moderation", items: ["/mod bannedword add|remove|list"] },
      { title: "Logging", items: ["/logging status"] },
      { title: "Leveling", items: ["/level me", "/level top"] },
      { title: "Welcome/Auto-Role", items: ["/welcome status", "/autorole status"] },
      { title: "Verification", items: ["/verify send"] },
      { title: "Tickets", items: ["/ticketpanel create", "/ticketpanel send"] },
      { title: "Reaction Roles", items: ["/rrmenu create", "/rrmenu add", "/rrmenu send"] },
      { title: "ServerStats", items: ["/serverstats setup", "/serverstats status"] },
      { title: "Poll", items: ["/poll create"] },
      { title: "Giveaway", items: ["/giveaway start", "/giveaway end"] },
      { title: "Fun", items: ["/coinflip", "/rps"] }
    ];

    const filtered = q
      ? groups
          .map((g) => ({
            title: g.title,
            items: g.items.filter((i) => i.toLowerCase().includes(q))
          }))
          .filter((g) => g.items.length > 0)
      : groups;

    const embed = new EmbedBuilder()
      .setTitle(q ? `Befehle (Suche: ${q})` : "Befehle")
      .setDescription(
        "Viele Features werden im Webpanel konfiguriert (Kanäle/Rollen/Module)."
      )
      .setColor(0x5865f2);

    for (const g of filtered) embed.addFields({ name: g.title, value: g.items.join("\n") });

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};

