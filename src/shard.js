require("dotenv").config();

const { ShardingManager } = require("discord.js");
const token = process.env.TOKEN;
const manager = new ShardingManager("./src/bot.js", {
  token: token,
});

manager.on("shardCreate", (shard) => {
  require("./handlers/ready.js")(manager);
});
manager.spawn({ amount: 3 }).catch(() => console.log("Failed to spawn shards"));

require("./handlers/express.js")(manager);
