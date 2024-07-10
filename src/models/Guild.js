const { Schema, model } = require("mongoose");

const GuildSchemaa = new Schema({
  guildId: {
    type: String,
    required: true,
    unique: true,
  },

  modlogs: String,
  autorole: String,

  banned: Boolean,
});

module.exports = model("Guildxxxxxxxxx", GuildSchemaa);
