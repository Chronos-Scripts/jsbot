const express = require("express");

module.exports = function (m) {
  const app = express();

  app.get("/guilds", async (req, res) => {
    res.send(await m.fetchClientValues("guilds.cache.size"));
  });

  app.get("/commands", async (req, res) => {
    const commands = await m.application.commands.fetch();
    res.send(commands.map((cmd) => cmd.name));
  });

  app.listen(3000, () => {
    console.log("Express is running on port 3000");
  });
};
