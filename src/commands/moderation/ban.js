const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Guild,
} = require('discord.js');
const config = require('../../../config.json')  

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */

  callback: async (client, interaction) => {
    const targetUserId = interaction.options.get('target-user').value;
    const reason =
      interaction.options.get('reason')?.value || 'No reason provided';

    await interaction.deferReply();

    const targetUser = await interaction.guild.members.fetch(targetUserId);

    if (!targetUser) {
      await interaction.editReply("That user doesn't exist in this server.");
      return;
    }

    if (targetUser.id === interaction.guild.ownerId) {
      await interaction.editReply(
        "You can't ban that user because they're the server owner."
      );
      return;
    }

    const targetUserRolePosition = targetUser.roles.highest.position; // Highest role of the target user
    const requestUserRolePosition = interaction.member.roles.highest.position; // Highest role of the user running the cmd
    const botRolePosition = interaction.guild.members.me.roles.highest.position; // Highest role of the bot

    if (targetUserRolePosition >= requestUserRolePosition) {
      await interaction.editReply(
        "You can't ban that user because they have the same/higher role than you."
      );
      return;
    }

    if (targetUserRolePosition >= botRolePosition) {
      await interaction.editReply(
        "I can't ban that user because they have the same/higher role than me."
      );
      return;
    }

    // Ban the targetUser
    try {
      const ServerEmbed = new EmbedBuilder()
      .setColor(0x0099FF)
      .setDescription(`${targetUser} was banned`)
      .setFooter(config.footer)

      const banEmbed = new EmbedBuilder()
      .setColor(0x0099FF)
      .setDescription(`You have been banned from ${interaction.guild.name} to appeal, join the support server.`)
      .setFooter(config.footer)

      const button = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
       .setLabel('Support Server')
       .setStyle(ButtonStyle.Link)
       .setURL('https://discord.gg/bWRFs6Bx')
      );

      await targetUser.send({embeds: [banEmbed], components: [button]})
      await targetUser.ban({ reason });

      await interaction.editReply(
        {embeds: [ServerEmbed]}
      );
    } catch (error) {
      console.log(`There was an error while banning: ${error}`);
    }
  },

  name: 'ban',
  description: 'Bans a member from this server.',
  options: [
    {
      name: 'target-user',
      description: 'The user you want to ban.',
      type: ApplicationCommandOptionType.Mentionable,
      required: true,
    },
    {
      name: 'reason',
      description: 'The reason you want to ban.',
      type: ApplicationCommandOptionType.String,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.BanMembers],
  botPermissions: [PermissionFlagsBits.BanMembers],
  enabled: true,
};
