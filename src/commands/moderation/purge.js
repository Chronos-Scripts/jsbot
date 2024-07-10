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
      const targetAmount = interaction.options.getInteger('Count')

      await interaction.deferReply();

      const embed = new EmbedBuilder()
      .setColor(0x0099FF)
      .setDescription(`✔️ Successfuly deleted ${targetAmount} messages from ${interaction.channel}`)
      .setFooter(config.footer)

      await interaction.channel.bulkDelete(targetAmount);
      
      const button = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
       .setCustomId('purge')
       .setEmoji('🗑️')
       .setStyle(ButtonStyle.Primary)
      );

      const message = await interaction.editReply({embeds: [embed], components: [button]});

      const collector = message.createMessageComponentCollector();

      collector.on('collect', async i => {
        if (i.customId === 'purge') {
          interaction.deleteReply();
        }
      });
      return;
    },  
  
    name: 'clear',
    description: 'clear messages.',
    options: [
      {
        name: 'amount',
        description: 'The number of messages you want to delete.',
        type: ApplicationCommandOptionType.Integer,
        required: true,
      },
    ],
    permissionsRequired: [PermissionFlagsBits.ManageMessages],
    botPermissions: [PermissionFlagsBits.ManageMessages],
    enabled: true,
  };
  