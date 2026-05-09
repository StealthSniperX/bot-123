import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction
} from "discord.js";
import type { SlashCommand } from "../types.js";
import { getGuildConfig, setGuildConfig } from "../../guild-config.js";

export const modCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("mod")
    .setDescription("Moderations-Einstellungen")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommandGroup((g) =>
      g
        .setName("bannedword")
        .setDescription("Unerwünschte Wörter")
        .addSubcommand((s) =>
          s
            .setName("add")
            .setDescription("Wort hinzufügen")
            .addStringOption((o) => o.setName("wort").setDescription("Wort").setRequired(true))
        )
        .addSubcommand((s) =>
          s
            .setName("remove")
            .setDescription("Wort entfernen")
            .addStringOption((o) => o.setName("wort").setDescription("Wort").setRequired(true))
        )
        .addSubcommand((s) => s.setName("list").setDescription("Liste anzeigen"))
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.guildId) return interaction.reply({ content: "Nur im Server.", ephemeral: true });
    const cfg = await getGuildConfig(interaction.guildId);
    const group = interaction.options.getSubcommandGroup(true);
    const sub = interaction.options.getSubcommand(true);
    if (group !== "bannedword") {
      return interaction.reply({ content: "Unbekannt.", ephemeral: true });
    }
    if (sub === "list") {
      const list = cfg.moderation.bannedWords;
      return interaction.reply({
        content: list.length ? list.map((w) => `- ${w}`).join("\n") : "Keine Wörter gesetzt.",
        ephemeral: true
      });
    }
    const word = interaction.options.getString("wort", true).toLowerCase();
    if (sub === "add") {
      if (!cfg.moderation.bannedWords.includes(word)) cfg.moderation.bannedWords.push(word);
      await setGuildConfig(interaction.guildId, cfg);
      return interaction.reply({ content: `Hinzugefügt: ${word}`, ephemeral: true });
    }
    if (sub === "remove") {
      cfg.moderation.bannedWords = cfg.moderation.bannedWords.filter((w) => w !== word);
      await setGuildConfig(interaction.guildId, cfg);
      return interaction.reply({ content: `Entfernt: ${word}`, ephemeral: true });
    }
    return interaction.reply({ content: "Unbekannt.", ephemeral: true });
  }
};

