import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  EmbedBuilder
} from "discord.js";
import type { SlashCommand } from "../types.js";
import { nanoid } from "nanoid";
import { getGuildConfig, setGuildConfig } from "../../guild-config.js";

export const ticketpanelCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("ticketpanel")
    .setDescription("Ticket System (Panels)")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand((s) =>
      s
        .setName("config")
        .setDescription("Kategorie/Support-Rolle setzen")
        .addChannelOption((o) =>
          o
            .setName("kategorie")
            .setDescription("Category Channel")
            .addChannelTypes(ChannelType.GuildCategory)
            .setRequired(true)
        )
        .addRoleOption((o) =>
          o.setName("supportrolle").setDescription("Support Rolle").setRequired(false)
        )
    )
    .addSubcommand((s) =>
      s
        .setName("create")
        .setDescription("Panel erstellen")
        .addStringOption((o) => o.setName("titel").setDescription("Titel").setRequired(true))
        .addStringOption((o) =>
          o.setName("beschreibung").setDescription("Beschreibung").setRequired(true)
        )
        .addStringOption((o) =>
          o.setName("button").setDescription("Button Label").setRequired(false)
        )
    )
    .addSubcommand((s) =>
      s
        .setName("send")
        .setDescription("Panel senden")
        .addStringOption((o) => o.setName("panel_id").setDescription("ID").setRequired(true))
        .addChannelOption((o) =>
          o
            .setName("channel")
            .setDescription("Ziel-Channel")
            .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
            .setRequired(true)
        )
    )
    .addSubcommand((s) => s.setName("list").setDescription("Panels auflisten")),
  async execute(interaction) {
    if (!interaction.guildId) return interaction.reply({ content: "Nur im Server.", ephemeral: true });
    const cfg = await getGuildConfig(interaction.guildId);
    const sub = interaction.options.getSubcommand(true);

    if (sub === "config") {
      const category = interaction.options.getChannel("kategorie", true);
      const supportRole = interaction.options.getRole("supportrolle");
      cfg.tickets ??= {};
      cfg.tickets.categoryId = category.id;
      cfg.tickets.supportRoleId = supportRole?.id;
      cfg.modules.tickets = true;
      await setGuildConfig(interaction.guildId, cfg);
      return interaction.reply({ content: "✅ Ticket-Konfig gespeichert.", ephemeral: true });
    }

    if (sub === "create") {
      const id = nanoid(8);
      const title = interaction.options.getString("titel", true);
      const description = interaction.options.getString("beschreibung", true);
      const buttonLabel = interaction.options.getString("button") ?? "Ticket erstellen";
      cfg.ticketPanels ??= [];
      cfg.ticketPanels.push({ id, title, description, buttonLabel });
      cfg.modules.tickets = true;
      await setGuildConfig(interaction.guildId, cfg);
      return interaction.reply({ content: `✅ Panel erstellt. ID: \`${id}\``, ephemeral: true });
    }

    if (sub === "list") {
      const panels = cfg.ticketPanels ?? [];
      const text = panels.length
        ? panels.map((p) => `- \`${p.id}\` ${p.title}`).join("\n")
        : "Keine Panels.";
      return interaction.reply({ content: text, ephemeral: true });
    }

    if (sub === "send") {
      const panelId = interaction.options.getString("panel_id", true);
      const channel = interaction.options.getChannel("channel", true);
      const panel = cfg.ticketPanels?.find((p) => p.id === panelId);
      if (!panel) return interaction.reply({ content: "Panel-ID nicht gefunden.", ephemeral: true });
      if (!("send" in channel)) return interaction.reply({ content: "Channel ungültig.", ephemeral: true });

      const embed = new EmbedBuilder().setTitle(panel.title).setDescription(panel.description).setColor(0x5865f2);
      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId(`ticket:open:${panel.id}`)
          .setLabel(panel.buttonLabel)
          .setStyle(ButtonStyle.Primary)
      );
      await (channel as any).send({ embeds: [embed], components: [row] });
      return interaction.reply({ content: "✅ Gesendet.", ephemeral: true });
    }

    return interaction.reply({ content: "Unbekannt.", ephemeral: true });
  }
};
