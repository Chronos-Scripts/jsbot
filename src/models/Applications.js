const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  guildId: {
    type: String,
    required: true,
  },

  Applications: {
    type: Array,
    default: [],
  },
});

module.exports = model("Applicationstesting", userSchema);
