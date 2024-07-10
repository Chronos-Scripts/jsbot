require("colors");

module.exports = async function (manager) {
  const shards = manager.shards;
  shards.forEach((shard) => {
    shard.once("ready", async () => {
      const guilds = await shard.fetchClientValue("guilds.cache");
      console.log(
        `Shard #${shard.id} | ServerCount: ${await shard.fetchClientValue(
          "guilds.cache.size"
        )} | Servers: [${guilds.map((guild) => guild.name)}]`
      );
    });
  });
};
