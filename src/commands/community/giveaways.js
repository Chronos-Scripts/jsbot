const {
  Client,
  Interaction,
  PermissionFlagsBits,
  ApplicationCommandOptionType,
  EmbedBuilder,
} = require("discord.js");
const ms = require("ms");

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    const sub = interaction.options.getSubcommand();

    switch (sub) {
      case "start":
        const duration = interaction.options.getString("duration");
        const winnerCount = interaction.options.getInteger("winners");
        const prize = interaction.options.getString("prize");
        const channel =
          interaction.options.getChannel("channel") || interaction.channel;

        client.giveawaysManager
          .start(channel, {
            duration: ms(duration),
            winnerCount,
            prize,
            hostedBy: `${interaction.user}`,
            messages: {
              giveaway: `🎁🎁 **GIVEAWAY** 🎁🎁`,
              giveawayEnded: `🎁🎁 **GIVEAWAY ENDED** 🎁🎁`,
              inviteToParticipate: `⚬ React with 🎉 to participate!`,
              drawing: `⚬ Ending: {timestamp}`,
              hostedBy: `⚬ Hosted by: {this.hostedBy}`,
              winners: `pro`,
              winMessage: `{winners} Congratulations! You won **{this.prize}**, Hosted by: **{this.hostedBy}**.`,
            },
          })
          .then((data) => {
            interaction.reply({
              content: `Giveaway started! ${
                channel === interaction.channel ? "" : `Check ${channel}`
              }`,
              ephemeral: true,
            });
          });
        break;
      case "end":
        const messageid = interaction.options.getString("message-id");

        client.giveawaysManager.end(messageid).then(() => {
          interaction
            .reply({
              content: "Giveaway ended.",
              ephemeral: true,
            })
            .catch((err) => {
              interaction.reply({
                content: `Failed to end giveaway`,
                ephemeral: true,
              });
            });
        });
        break;
      case "edit":
        const messageid1 = interaction.options.getString("message-id");
        const newDuration = interaction.options.getString("time");
        const newWinnerCount = interaction.options.getInteger("winners");
        const newPrize = interaction.options.getString("prize");

        client.giveawaysManager
          .edit(messageid1, {
            addTime: ms(newDuration),
            newWinnerCount: newWinnerCount,
            newPrize: newPrize,
          })
          .then(() => {
            interaction.reply({
              content: "Giveaway edited.",
              ephemeral: true,
            });
          })
          .catch((err) => {
            interaction.reply(`Failed to edit giveaway.`);
          });

        break;
      case "reroll":
        const messageId = interaction.options.getString("message-id");

        client.giveawaysManager
          .reroll(messageId)
          .then(() => {
            interaction.reply({
              content: "Giveaway rerolled!",
              ephemeral: true,
            });
          })
          .catch((err) => {
            interaction.reply(
              `An error has occurred, please check and try again.\n\`${err}\``
            );
          });
        break;
    }
  },

  name: "giveaway",
  description: "Start a giveaway",
  options: [
    {
      name: "start",
      type: ApplicationCommandOptionType.Subcommand,
      description: "Starts a giveaway.",
      options: [
        {
          name: "duration",
          description: "The duration of the giveaway.",
          type: ApplicationCommandOptionType.String,
          required: true,
        },

        {
          name: "winners",
          description: "The number of winners.",
          type: ApplicationCommandOptionType.Integer,
          required: true,
        },

        {
          name: "prize",
          description: "What the winners will win.",
          type: ApplicationCommandOptionType.String,
          required: true,
        },

        {
          name: "channel",
          description: "The channel for the giveaway to start in.",
          type: ApplicationCommandOptionType.Channel,
          required: false,
        },
      ],
    },

    {
      name: "edit",
      description: "Edit a giveaway.",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "message-id",
          description: "The ID of the giveaway message.",
          type: ApplicationCommandOptionType.String,
          required: true,
        },

        {
          name: "time",
          description: "The added time for the giveaway.",
          type: ApplicationCommandOptionType.String,
          required: true,
        },

        {
          name: "winners",
          description: "The updated number of winners for the giveaway.",
          type: ApplicationCommandOptionType.Integer,
          required: true,
        },

        {
          name: "prize",
          description: "The new prize for the giveaway.",
          type: ApplicationCommandOptionType.String,
          required: false,
        },
      ],
    },

    {
      name: "end",
      description: "End a giveaway.",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "message-id",
          description: "The ID of the giveaway message.",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
    },

    {
      name: "reroll",
      description: "Reroll a giveaway.",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "message-id",
          description: "The ID of the giveaway message.",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
    },
  ],
  enabled: true,
  permissionsRequired: [PermissionFlagsBits.ManageGuild],
};
