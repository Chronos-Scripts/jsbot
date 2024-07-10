const {
    Client,
    Interaction,
    ApplicationCommandOptionType,
    PermissionFlagsBits,
    GuildBanManager,
    GuildBan,
    EmbedBuilder,
  } = require('discord.js');
  const config = require('../../../config.json')
  
  module.exports = {
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     */
  
    callback: async (client, interaction) => {
      const targetUserId = interaction.options.get('target-id')?.value;
  
      await interaction.deferReply();

      let user;

      // unBan the targetUser
      try {
        const ban = await interaction.guild.bans.fetch(`${targetUserId}`);
        user = await ban.user.fetch();

        const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setFooter(config.footer) 
        .setTimestamp()

        await interaction.guild.members.unban(targetUserId, "banned");
        embed.setDescription(`${targetUserId}  was unbanned`)
        await interaction.editReply(
          {embeds: [embed]}
        );
      } catch (error) {
        if (error.name === 'DiscordAPIError[10026]') {
          await interaction.editReply(
            `<@${targetUserId}> isn't banned.`
          );
          return;
        } else {
          console.log(`There was an error when banning: ${error.message}`);
        }
      }
    },
  
    name: 'unban',
    description: 'Unbans a member from this server.',
    options: [
      {
        name: 'target-id',
        description: 'The user you want to ban.',
        type: ApplicationCommandOptionType.String,  
        required: true,
      },
    ],
    permissionsRequired: [PermissionFlagsBits.BanMembers],
    botPermissions: [PermissionFlagsBits.BanMembers],
    enabled: true,
  };