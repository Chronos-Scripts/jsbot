const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  userId: {
    type: String,
    required: false,
    unique: true,
  },

  message: {
    type: String,
    required: true,
  },

  Answers: {
    type: Array,
    default: [],
  },
});

module.exports = model("ApplicationstestingData", userSchema);
