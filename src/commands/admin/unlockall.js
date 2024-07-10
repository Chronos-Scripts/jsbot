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
    name: 'unlockall',
    description: 'unlocks server',
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
        var channels = interaction.guild.channels.cache
        .filter((ch) => ch.type === 0)
        for (const channel of channels) {
            if (!channel[1].permissionOverwrites) { continue };
            channel[1].permissionOverwrites.create(interaction.guild.id, {SendMessages: true})
        }

        
        const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setDescription(`:white_check_mark: Unlocked Server`)
        .setFooter(config.footer)
        .setTimestamp()

        await interaction.editReply({embeds: [embed]}); 
    }
}