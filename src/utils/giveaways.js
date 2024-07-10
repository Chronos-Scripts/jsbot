const { GiveawaysManager: gw } = require("discord-giveaways");
const GiveawayModel = require("../models/Giveaways");

module.exports = class giveawayManager extends gw {
  async getAllGiveaways() {
    return await GiveawayModel.find().lean().exec();
  }

  async saveGiveaway(messageId, giveawayData) {
    return await GiveawayModel.create(giveawayData);
  }

  async editGiveaway(messageId, giveawayData) {
    return await GiveawayModel.updateOne({ messageId }, giveawayData, {
      omitUndefined: true,
    }).exec();
  }

  async deleteGiveaway(messageId) {
    return await GiveawayModel.deleteOne({ messageId }).exec();
  }
};
