const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const ms = require('ms');
const timeout = require('./timeout');
require("colors")

module.exports = {
    /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */

    callback: async (client, interaction) => {
        const mentionable = interaction.options.get('target-user').value;

        await interaction.deferReply();

        const targetUser = await interaction.guild.members.fetch(mentionable);
        if (!targetUser) {
            await interaction.editReply("That user doesn't exist in this server.");
            return;
        }

        if (!targetUser.isCommunicationDisabled()) {
            await interaction.editReply("That user isn't timed out.");
            return;
        }

        try {
            await targetUser.timeout(null)
            await interaction.editReply(`Successfully un-timed out ${targetUser.user.username}`);
            await targetUser.send(`You have been un-timed out from ${interaction.guild.name}`);   
        } catch (error) {
            console.log(`[ERROR] ${error.message}`.red);
        }
    },

    name: 'untimeout',
  description: 'Untimeout a user.',
  options: [
    {
        name: 'target-user',
        description: 'The user you want to untimeout.',
        type: ApplicationCommandOptionType.Mentionable,
        required: true,
      },
  ],
  enabled: true,
  permissionsRequired: [PermissionFlagsBits.MuteMembers],
  botPermissions: [PermissionFlagsBits.MuteMembers],
}