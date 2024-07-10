const { Client, GuildMember } = require('discord.js');
const Guild = require('../../models/Guild');

/**
 *
 * @param {Client} client
 * @param {GuildMember} member
 */
module.exports = async (client, member) => {
  try {
    let guild = member.guild;
    if (!guild) return;

    const guil = await Guild.findOne({ guildId: guild.id });
    if (!guil) return;
    if (!guil.AutoRoleEnabled) return;

    await member.roles.add(guil.roleId);
  } catch (error) {
    console.log(`Error giving role automatically: ${error}`);
  }
};
