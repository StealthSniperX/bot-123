import type { SlashCommand } from "./types.js";
import { pingCommand } from "./commands/ping.js";
import { helpCommand } from "./commands/help.js";
import { infoCommand } from "./commands/info.js";
import { coinflipCommand, rpsCommand } from "./commands/fun.js";
import { modCommand } from "./commands/mod.js";
import { levelCommand } from "./commands/level.js";
import { pollCommand } from "./commands/poll.js";
import { welcomeCommand } from "./commands/welcome.js";
import { autoroleCommand } from "./commands/autorole.js";
import { loggingCommand } from "./commands/logging.js";
import { verifyCommand } from "./commands/verify.js";
import { embedCommand } from "./commands/embed.js";
import { rrmenuCommand } from "./commands/rrmenu.js";
import { ticketpanelCommand } from "./commands/tickets.js";
import { serverstatsCommand } from "./commands/serverstats.js";
import { giveawayCommand } from "./commands/giveaway.js";
import { jtcCommand } from "./commands/jtc.js";

export const allCommands: SlashCommand[] = [
  pingCommand,
  helpCommand,
  infoCommand,
  coinflipCommand,
  rpsCommand,
  modCommand,
  levelCommand,
  pollCommand,
  welcomeCommand,
  autoroleCommand,
  loggingCommand,
  verifyCommand,
  embedCommand,
  rrmenuCommand,
  ticketpanelCommand,
  serverstatsCommand,
  giveawayCommand,
  jtcCommand
];

