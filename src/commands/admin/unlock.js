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
    name: 'unlock',
    description: 'unlocks a channel',
    options: [
        {
            name: 'channel',
            type: ApplicationCommandOptionType.Channel,
            description: 'The channel to unlock',
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

        channel.permissionOverwrites.create(interaction.guild.id, {SendMessages: true})

        const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setDescription(`:white_check_mark: Unlocked channel ${channel}`)
        .setFooter(config.footer)
        .setTimestamp()

        await interaction.editReply({embeds: [embed]}); 
    }
}