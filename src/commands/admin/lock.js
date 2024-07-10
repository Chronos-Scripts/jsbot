const {
    Client,
    Interaction,
    ApplicationCommandOptionType,
    PermissionFlagsBits,
    GuildBanManager,
    GuildBan,
    EmbedBuilder,
    StringSelectMenuBuilder,
    ActionRowBuilder,
    ThreadChannel,
  } = require('discord.js');
const config = require('../../../config');
const fs = require('fs');

module.exports = {
    name: 'lock',
    description: 'locks a channel',
    options: [
        {
            name: 'channel',
            type: ApplicationCommandOptionType.Channel,
            description: 'The channel to lock',
            required: true,
        }
    ],
    enabled: true,
    permissionsRequired: [PermissionFlagsBits.Administrator],

    /**
     * 
     * @param {Client} client
     * @param {Interaction} interaction
     * 
     */

    callback: async (client, interaction) => {
        await interaction.deferReply();
        let channel = interaction.options.getChannel('channel');  

        channel.permissionOverwrites.create(interaction.guild.id, {SendMessages: false})

        const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setDescription(`:white_check_mark: Locked channel ${channel}`)
        .setFooter(config.footer)
        .setTimestamp()

        await interaction.editReply({embeds: [embed]}); 
    }
}