const db = require("../models/dashUsers");
const { verify } = require("jsonwebtoken");

module.exports = async (ctx, next) => {
  const token = ctx.cookies.get("token");
  console.log(token);

  try {
    const { sub } = await verify(token, process.env.jwt_token);
    ctx.state.user = await db.findOne({ discordId: sub });
  } catch (e) {
    ctx.state.user = null;
  }

  await next();
};
