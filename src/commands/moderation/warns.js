const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  GuildBanManager,
  GuildBan,
  EmbedBuilder,
} = require("discord.js");
const User = require("../../models/User");

module.exports = {
  name: "warns",
  description: `View members' warnings`,
  options: [
    {
      name: "user",
      type: ApplicationCommandOptionType.Mentionable,
      description: "The user view warns",
      required: false,
    },
  ],
  enabled: true,
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    await interaction.deferReply();

    if (!interaction.inGuild()) {
      interaction.reply({
        content: "You can only run this command inside a server.",
        ephemeral: true,
      });
      return;
    }

    const targetUser =
      interaction.options.getUser("user") || interaction.member;

    const query = {
      userId: targetUser.id,
      guildId: interaction.guild.id,
    };

    let user = await User.findOne(query);
    let warns;

    try {
      const Serverembed = new EmbedBuilder().setColor(0x0099ff).setTimestamp();

      if (user) {
        console.log(user.warns);
        warns = user.warns;
      } else {
        Serverembed.setDescription(
          `${targetUser.user.displayName} has no warnings`
        );
        interaction.editReply({ embeds: [Serverembed] });
        return;
      }

      let warncount = 0;

      console.log(targetUser);
      warns.forEach(function (warning) {
        const removed = warning.removed ? ":x:" : ":white_check_mark:";
        warncount = warncount + 1;
        Serverembed.addFields({
          name: `⚬ ${removed} ${warning.id}`,
          value: `** **`,
          inline: false,
        });
      });

      if (!warncount == 0) {
        Serverembed.setTitle(
          `${
            targetUser.user.displayName | targetUser.user.globalName
          }'s warnings:`
        );
        Serverembed.setFooter({ text: `${warncount}` });
        await interaction.editReply({ embeds: [Serverembed] });
      } else {
        Serverembed.setDescription(
          `${
            targetUser.user.displayName | targetUser.user.globalName
          } has no warnings`
        );
        interaction.editReply({ embeds: [Serverembed] });
      }
    } catch (error) {
      interaction.editReply({
        content: "An error occured while checking warns",
      });
      console.log(`An error occured while checking warns: ${error.message}`);
    }
  },
};
