const {
    Client,
    Interaction,
    ApplicationCommandOptionType,
    PermissionFlagsBits,
    EmbedBuilder,
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
      const targetUser = interaction.options.getUser('user') || interaction.user;
      console.log(targetUser);
      const member = await interaction.guild.members.fetch(targetUser.id)
      const tag = targetUser.tag;
      const icon = targetUser.displayAvatarURL();
      const Booster = member.premiumSince? ':white_check_mark:' : ':x:';

      await interaction.deferReply();
      
      try {
        const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setAuthor({ name: tag, iconURL: icon})
        .setThumbnail(icon)
        .addFields({ name: 'Member', value: `${targetUser}`, inline: true})
        .addFields({ name: 'Identifier', value: `${targetUser.id}`, inline: true})
        .addFields({ name: 'Roles', value: `${member.roles.cache.map(r => r).join(' ')}`, inline: false})
        .addFields({ name: 'Booster', value: `${Booster}`, inline: true})
        .addFields({ name: 'Joined Server', value: `<t:${parseInt(member.joinedAt / 1000)}:R>`, inline: true})
        .addFields({ name: 'Joined Discord', value: `<t:${parseInt(targetUser.createdAt / 1000)}:R>`, inline: true})
        .setFooter(config.footer)
        .setTimestamp()
        
        await interaction.editReply({ embeds: [embed] });
      } catch (error) {
        console.log(`[ERROR] ${error.message}`.red);
      }
    },
  
    name: 'whois',
    description: 'get info about users.',
    options: [
      {
        name: 'user',
        description: 'The user you want info about.',
        type: ApplicationCommandOptionType.Mentionable,
        required: false,
      },
    ],
    permissionsRequired: [],
    botPermissions: [],
    enabled: true,
  };
  