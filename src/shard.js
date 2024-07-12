require("dotenv").config();

const { ShardingManager } = require("discord.js");
const token = process.env.TOKEN;
const manager = new ShardingManager("./src/bot.js", {
  token: token,
});
const mongoose = require("mongoose");

async () => {
  mongoose.set("strictQuery", false);
  await mongoose.connect(process.env.MONGODB_URI);
};

manager.on("shardCreate", (shard) => {
  require("./handlers/ready.js")(manager);
});
manager.spawn({ amount: 3 }).catch(() => console.log("Failed to spawn shards"));

require("./handlers/api.js")(manager);
