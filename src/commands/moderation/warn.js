const {
    Client,
    Interaction,
    ApplicationCommandOptionType,
    PermissionFlagsBits,
    GuildBanManager,
    GuildBan,
    EmbedBuilder,
  } = require('discord.js');
const User = require('../../models/User');
const Warns = require('../../models/warns');
const config = require('../../../config');  

module.exports = {
    name: 'warn',
  description: 'Warn a user.',
  options: [
    {
        name: 'user',
        type: ApplicationCommandOptionType.Mentionable,
        description: 'The user to warn',
        required: true,
    },

    {
        name: 'reason',
        type: ApplicationCommandOptionType.String,
        description: 'The reason for the warn',
        required: false,
    }
 ],
  enabled: true,
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    await interaction.deferReply();

    if (!interaction.inGuild()){
        interaction.reply({
            content: 'You can only run this command inside a server.',
            ephemeral: true,
        });
        return; 
    }

    const targetUser = interaction.options.getUser('user')  
    const reason = interaction.options.getString('reason') || 'No reason provided'

    const query = {
        userId: targetUser.id,
        guildId: interaction.guild.id,
      };

      let user = await User.findOne(query);
      let warnings = await Warns.findOne({ guildId: interaction.guild.id });

      
      if (!warnings) {
        warnings = new Warns({
          guildId: interaction.guild.id,
          amount: 0,
        });
      }

      try {
        if (user) {
            console.log(user.warns)
            user.warns.push({
                reason: reason,
                moderator: interaction.member.user.tag,
                date: `${Date.now()}`,
                id: warnings.amount+1
            });
          } else {
            user = new User({
                ...query,
                warns: [
                    {
                        reason: reason,
                        moderator: interaction.member.user.tag,
                        date: `${Date.now()}`,
                        id: warnings.amount+1
                    }
                ]
              });
          } 

          warnings.amount = warnings.amount + 1;  

          await user.save();
          await warnings.save();
          const Serverembed = new EmbedBuilder()
          .setColor(0x0099FF)
          .setDescription(`<@${targetUser.id}> has been warned`)
          .addFields({name: `Reason`, value: `${reason}`, inline: false})
          .addFields({name: `Warned by`, value: `<@${interaction.member.id}>`, inline: true})
          .addFields({name: `WarnID`, value: `${warnings.amount}`, inline: true})
          .setTimestamp()

          const Userembed = new EmbedBuilder()
          .setColor(0x0099FF)
          .setDescription(`You have been warned in **${interaction.guild.name}**`)
          .addFields({name: `Reason`, value: `${reason}`, inline: false})
          .addFields({name: `Warned by`, value: `${interaction.member.user.displayName}`, inline: true})

          await targetUser.send({embeds: [Userembed]});
          await interaction.editReply({embeds: [Serverembed]});
      } catch (error) {
        interaction.editReply({content: 'An error occured while warning'});
        console.log(`An error occured while warning: ${error.message}`);
      }
  }
}