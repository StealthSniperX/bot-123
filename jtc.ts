import { SlashCommandBuilder } from "discord.js";
import type { SlashCommand } from "../types.js";

export const coinflipCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("coinflip")
    .setDescription("Wirf eine Münze"),
  async execute(interaction) {
    const r = Math.random() < 0.5 ? "Kopf" : "Zahl";
    await interaction.reply({ content: `🪙 ${r}`, ephemeral: false });
  }
};

export const rpsCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("rps")
    .setDescription("Schere/Stein/Papier")
    .addStringOption((o) =>
      o
        .setName("wahl")
        .setDescription("Deine Wahl")
        .setRequired(true)
        .addChoices(
          { name: "Schere", value: "scissors" },
          { name: "Stein", value: "rock" },
          { name: "Papier", value: "paper" }
        )
    ),
  async execute(interaction) {
    const you = interaction.options.getString("wahl", true);
    const opts = ["scissors", "rock", "paper"] as const;
    const bot = opts[Math.floor(Math.random() * opts.length)];

    const win =
      (you === "scissors" && bot === "paper") ||
      (you === "rock" && bot === "scissors") ||
      (you === "paper" && bot === "rock");
    const draw = you === bot;

    const pretty: Record<string, string> = {
      scissors: "Schere",
      rock: "Stein",
      paper: "Papier"
    };

    await interaction.reply({
      content: `Du: ${pretty[you]} | Bot: ${pretty[bot]} -> ${
        draw ? "Unentschieden" : win ? "Du gewinnst" : "Bot gewinnt"
      }`
    });
  }
};

