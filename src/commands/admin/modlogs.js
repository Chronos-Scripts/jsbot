const {
  Client,
  Interaction,
  PermissionFlagsBits,
  ApplicationCommandOptionType,
  EmbedBuilder,
} = require("discord.js");
const Guild = require("../../models/Guild");

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    try {
      await interaction.deferReply();
      var guild = await Guild.findOne({ guildId: interaction.guild.id });

      const embed = new EmbedBuilder().setColor(0x0099ff).setTimestamp();

      if (interaction.options.getSubcommand() == "enable") {
        const channel = interaction.options.getChannel("channel");

        if (!guild) {
          guild = new Guild({
            guildId: interaction.guild.id,
            modlogs: channel.id,
          });

          embed.setDescription(
            `Mod logging has been enabled in ${channel} for this server.`
          );
        } else {
          if (guild.modlogs === channel.id) {
            embed.setDescription(
              `Mod logging is already enabled in ${channel} for this server.`
            );
            return;
          } else {
            guild.modlogs = channel.id;

            embed.setDescription(
              `Mod logging has been enabled in ${channel} for this server.`
            );
          }
        }
      } else {
        if (!guild) {
          embed.setDescription(
            "Mod logging has not been enabled for this server. Use `/modlogs enable` to enable it."
          );
        } else {
          guild.modlogs = "0x";
          embed.setDescription(
            "Mod logging has been disabled for this server. Use `/modlogs enable` to enable it again."
          );
        }
      }

      await interaction.editReply({ embeds: [embed] });
      guild.save();
    } catch (error) {
      console.log(error);
    }
  },

  name: "modlogs",
  description: "mod logging in this server.",
  permissionsRequired: [PermissionFlagsBits.Administrator],
  options: [
    {
      name: "enable",
      description: "Enable mod logging in this server.",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "channel",
          description: "The channel you want commands to be logged in.",
          type: ApplicationCommandOptionType.Channel,
          required: true,
        },
      ],
    },

    {
      name: "disable",
      description: "Disable mod logging in this server.",
      type: ApplicationCommandOptionType.Subcommand,
    },
  ],
  enabled: true,
};
