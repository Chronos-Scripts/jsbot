const express = require("express");
const fs = require("fs");
require("colors");
require("dotenv").config();
const shsh = [];
module.exports = function (m) {
  const app = express();

  app.use(logger);

  app.get("/guilds", async (req, res) => {
    res.send(await m.fetchClientValues("guilds.cache.size"));
  });

  app.get("/disable", async (req, res) => {}); // disable a command for a guild TODO

  app.get("/enable", async (req, res) => {}); // enable a command for a guild TODO

  app.get("/banuser/:id", async (req, res) => {
    res.send(req.params.id);
  }); // ban a user from ever using the bot TODO

  app.get("/banserver/:id", async (req, res) => {
    res.send(req.params.id);
  }); // ban a server from ever using the bot TODO

  app.get("/bannedusers", async (req, res) => {}); // get a list of banned users from the bot TODO

  app.get("/bannedservers", async (req, res) => {}); // get a list of banned servers from the bot TODO

  app.get("/commands", async (req, res) => {
    if (!m.shards.size === process.env.SHARD_COUNT) {
      console.log("Sharding not complete");
      return;
    }
    const commandFolders = fs
      .readdirSync("./src/commands")
      .filter((folder) => !folder.endsWith("."));
    const commandByCategory = {};

    for (const folder of commandFolders) {
      const commandFiles = fs
        .readdirSync(`./src/commands/${folder}`)
        .filter((file) => file.endsWith(".js"));
      const commands = [];

      for (const file of commandFiles) {
        const { default: command } = await import(
          `./../commands/${folder}/${file}`
        );
        commands.push({ name: command.name, description: command.description });
      }

      commandByCategory[folder] = commands;
    }
    res.send(commandByCategory);
  });

  app.get("/shardsd", (req, res) => {
    res.send(shsh);
  });

  app.listen(3243, () => {
    console.log("Express is running on port 3243");
  });

  m.shards.forEach((shard) => {
    shard.on("disconnect", () => {
      shsh.push(shard.id);
      console.log(
        `Shard ${shard.id} disconnected. ${
          m.shards.size - shsh.length
        } shards are still active.`
      );
    });
  });

  function logger(req, res, next) {
    console.log(
      `[API REQUEST]` +
        ` ` +
        `${req.originalUrl.slice(1, req.originalUrl.length)}`.green
    );
    next();
  }
};
