require("dotenv").config();
const {
  REST,
  Routes,
  Client,
  IntentsBitField,
  GatewayIntentBits,
} = require("discord.js");
const mongoose = require("mongoose");
const eventHandler = require("./handlers/eventHandler");
const config = require("../config.json");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
});
const rest = new REST().setToken(process.env.TOKEN);

(async () => {
  try {
    client.login(process.env.TOKEN);
  } catch (error) {
    console.log(`Error: ${error}`);
  }
})();

eventHandler(client);
client.setMaxListeners(999);

// Giveaways

const giveawayManager = require("./utils/giveaways");
client.giveawaysManager = new giveawayManager(client, {
  storage: false,
  default: {
    botsCanWin: false,
    embedColor: "#FF0000",
    embedColorEnd: "#000000",
    reaction: "🎉",
  },
});

// Logging

const logs = require("discord-logs");

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

logs(client, {
  debug: false,
});

const { handleLogs } = require("./utils/logs");
handleLogs(client);
