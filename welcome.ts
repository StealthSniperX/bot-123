import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ChannelType
} from "discord.js";
import type { SlashCommand } from "../types.js";
import { nanoid } from "nanoid";
import { getGuildConfig, setGuildConfig } from "../../guild-config.js";

export const rrmenuCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("rrmenu")
    .setDescription("Reaction Roles per Dropdown")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addSubcommand((s) =>
      s
        .setName("create")
        .setDescription("Neues Dropdown-Menü anlegen")
        .addStringOption((o) => o.setName("titel").setDescription("Titel").setRequired(true))
        .addStringOption((o) =>
          o.setName("placeholder").setDescription("Placeholder").setRequired(false)
        )
    )
    .addSubcommand((s) =>
      s
        .setName("add")
        .setDescription("Option hinzufügen")
        .addStringOption((o) => o.setName("menu_id").setDescription("ID").setRequired(true))
        .addStringOption((o) => o.setName("label").setDescription("Label").setRequired(true))
        .addRoleOption((o) => o.setName("rolle").setDescription("Rolle").setRequired(true))
    )
    .addSubcommand((s) =>
      s
        .setName("send")
        .setDescription("Menü senden")
        .addStringOption((o) => o.setName("menu_id").setDescription("ID").setRequired(true))
        .addChannelOption((o) =>
          o
            .setName("channel")
            .setDescription("Ziel-Channel")
            .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
            .setRequired(true)
        )
    ),
  async execute(interaction) {
    if (!interaction.guildId) return interaction.reply({ content: "Nur im Server.", ephemeral: true });
    const cfg = await getGuildConfig(interaction.guildId);
    const sub = interaction.options.getSubcommand(true);

    if (sub === "create") {
      const id = nanoid(8);
      const title = interaction.options.getString("titel", true);
      const placeholder = interaction.options.getString("placeholder") ?? "Wähle…";
      cfg.reactionRoleMenus ??= {};
      cfg.reactionRoleMenus[id] = { title, placeholder, options: [] };
      cfg.modules.reactionRoles = true;
      await setGuildConfig(interaction.guildId, cfg);
      return interaction.reply({ content: `✅ Menü erstellt. ID: \`${id}\``, ephemeral: true });
    }

    if (sub === "add") {
      const id = interaction.options.getString("menu_id", true);
      const label = interaction.options.getString("label", true);
      const role = interaction.options.getRole("rolle", true);
      const menu = cfg.reactionRoleMenus?.[id];
      if (!menu) return interaction.reply({ content: "Menü-ID nicht gefunden.", ephemeral: true });
      const value = nanoid(6);
      menu.options.push({ label, roleId: role.id, value });
      await setGuildConfig(interaction.guildId, cfg);
      return interaction.reply({ content: `✅ Option hinzugefügt (${label} -> ${role}).`, ephemeral: true });
    }

    if (sub === "send") {
      const id = interaction.options.getString("menu_id", true);
      const channel = interaction.options.getChannel("channel", true);
      const menu = cfg.reactionRoleMenus?.[id];
      if (!menu) return interaction.reply({ content: "Menü-ID nicht gefunden.", ephemeral: true });
      if (!("send" in channel)) return interaction.reply({ content: "Channel ungültig.", ephemeral: true });
      if (menu.options.length === 0) return interaction.reply({ content: "Keine Optionen im Menü.", ephemeral: true });

      const select = new StringSelectMenuBuilder()
        .setCustomId(`rrmenu:${id}`)
        .setPlaceholder(menu.placeholder)
        .addOptions(menu.options.map((o) => ({ label: o.label, value: o.value })));
      const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select);

      await (channel as any).send({ content: menu.title, components: [row] });
      return interaction.reply({ content: "✅ Gesendet.", ephemeral: true });
    }

    return interaction.reply({ content: "Unbekannt.", ephemeral: true });
  }
};
