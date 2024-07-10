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
      const announcementmessage =
        interaction.options.getString('message')
      const announcementtitle = interaction.options.getString('title') || ''  
      const announcementchannel = interaction.options.getChannel('channel')
console.log(announcementtitle);

      await interaction.deferReply();

      try {

        const embed = new EmbedBuilder()  
        .setColor(0x0099FF)
        .setDescription(announcementmessage)
        .setTimestamp()
        .setFooter(config.footer)

        if (announcementtitle != '') {
          embed.setTitle(announcementtitle)
        }

        await announcementchannel.send({embeds: [embed]});

        await interaction.editReply({content: `The announcement has been sent`, ephemeral: true}); 
      } catch (error) {
        console.log(`An error occured while trying to send announcement \n ${error}`.red)
        interaction.editReply({content: `An error occured while trying to send announcement`, ephemeral: true});
      }
    },
  
    name: 'say',
    description: 'embeds the given message.',
    options: [
      {
        name: 'message',
        description: 'The message you want to embe.',
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: 'channel',
        description: 'The channel you want to send the embed to.',
        type: ApplicationCommandOptionType.Channel,
        required: true,
      },
      {
        name: 'title',
        description: 'The title of the announcement.',
        type: ApplicationCommandOptionType.String,
        required: false,
      },
    ],
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.Administrator],
    enabled: true,
  };
  