const { Schema, model } = require('mongoose');

const warnSchema = new Schema({
  guildId: {
    type: String,
    required: true,
  },

  amount: {
    type: Number,
    default: 0,
  }
});

module.exports = model('warningsTESTING244', warnSchema);