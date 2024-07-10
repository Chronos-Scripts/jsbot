const { Schema, model } = require("mongoose");

const commands = new Schema({
  Guild: {
    type: String,
    required: true,
    unique: true,
  },

  banned: {
    type: String,
    unique: true,
  },
});

module.exports = model("BannedCommandsxxxxxxxxxxxxxxxxxx", commands);
