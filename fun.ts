import type { ChatInputCommandInteraction, Client } from "discord.js";

export type CommandContext = {
  client: Client;
};

export type SlashCommand = {
  data: any;
  execute: (
    interaction: ChatInputCommandInteraction,
    ctx: CommandContext
  ) => Promise<unknown>;
};
