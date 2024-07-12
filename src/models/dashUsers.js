const { Schema, model } = require("mongoose");
const userSchema = new Schema({
  discordId: {
    type: String,
    required: true,
    unique: true,
  },

  username: {
    type: String,
    required: false,
  },

  avatar: {
    type: String,
    required: false,
  },
});

module.exports = model("dashUsersTesting12412", userSchema);
