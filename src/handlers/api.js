const koa = require("koa");
const Router = require("@koa/router");
const cors = require("@koa/cors");
const bodyParser = require("koa-bodyparser");
const axios = require("axios");
const fs = require("fs");
const db = require("../models/dashUsers");
const authenticate = require("../api/authenticate");
const { sign } = require("jsonwebtoken");
require("colors");
require("dotenv").config();
const shsh = [];
module.exports = function (m) {
  const app = new koa();
  const router = new Router();

  app.use(
    cors({
      credentials: true,
    })
  );
  app.use(bodyParser());
  app.use(router.routes());
  app.use(router.allowedMethods());

  // router.use(authenticate);

  router.get("/user/me", async (ctx) => {
    ctx.body = ctx.state.user;
  });

  router.get("/guilds", async (ctx) => {
    try {
      ctx.body = await m.fetchClientValues("guilds.cache.size");
    } catch (err) {
      console.error(`${err.message}`.red);
      ctx.body = "Internal Server Error";
    }
  });

  router.get("/commands", async (ctx) => {
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
    ctx.body = commandByCategory;
  });

  router.get("/shardsd", async (ctx) => {
    ctx.body = shsh;
  });

  router.get("/shardsr", async (ctx) => {
    let nready = 0;

    m.shards.forEach((shard) => {
      if (shard.ready === false) nready++;
    });

    ctx.body = [m.shards.size - nready];
  });

  app.listen(4000, () => {
    console.log("API is running on port 4000");
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

    shard.on("ready", () => {
      if (shsh.length > 0) {
        if (shsh.find(shard.id)) {
          shard.splice(shsh.indexOf(shard.id), 1);
        }
      }
    });
  });

  router.get("/auth/discord", async (ctx) => {
    const url = process.env.authurl;

    ctx.redirect(url);
  });

  router.get("/auth/callback", async (ctx) => {
    try {
      const code = ctx.query.code;
      const params = new URLSearchParams({
        client_id: process.env.client_id,
        client_secret: process.env.secret,
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.redirecturl,
      });
      const headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept-Encoding": "application/x-www-form-urlencoded",
      };

      const response = await axios
        .post("https://discord.com/api/oauth2/token", params, {
          headers,
        })
        .catch(() => {
          console.log("error processing login request");
          return;
        });

      const userResponse = await axios.get(
        "https://discord.com/api/users/@me",
        {
          headers: {
            Authorization: `Bearer ${response.data.access_token}`,
            ...headers,
          },
        }
      );

      const { id, username, avatar } = userResponse.data;
      console.log(id, username, avatar);
      let user = await db.findOne({ discordId: id });

      console.log("e");
      if (user) {
        await db.findOneAndUpdate({
          discordId: id,
          username: username,
          avatar: avatar,
        });
      } else {
        user = new db({
          discordId: id,
          username,
          avatar,
        });
        await user.save();
      }

      console.log(user);

      const token = await sign({ sub: id }, process.env.jwt_token, {
        expiresIn: "7d",
      });
      // ctx.cookies.set()
      ctx.body = userResponse.data;
    } catch (error) {
      ctx.body = "Internal Server Error ";
      console.error(error.message);
    }
  });
};
