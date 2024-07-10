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
    name: 'removewarn',
    description: 'Remove a warn from a user',
    options: [
        {
            name: 'user',
            type: ApplicationCommandOptionType.Mentionable,
            description: 'The user to remove a warn from',
            required: true,
        },

        {
            name: 'warnid',
            type: ApplicationCommandOptionType.String,
            description: 'The ID of the warn to remove',
            required: true,
        },
    ],
    enabled: true,
    /**
     * 
     * @param {Client} client
     * @param {Interaction} interaction
     * 
     */

    callback: async (client, interaction) => {
        const targetUser = interaction.options.getUser('user');
        const warnid = interaction.options.getString('warnid');

        await interaction.deferReply();

        const query = {
            userId: targetUser.id,
            guildId: interaction.guild.id,
          };
    
          let user = await User.findOne(query);
          let warnings = await Warns.findOne({ guildId: interaction.guild.id });

        const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setFooter(config.footer)
        .setTimestamp()

        if (!user) {
            embed.setDescription('This user has no warns')
            await interaction.editReply({embeds: [embed]});
            return;
        }

        user.warns.forEach(function (warn) {
            if (warn.id == warnid) {
                const warnIndex = user.warns.indexOf(warn);
                const a = user.warns.at(warnIndex)
                const b = {
                    id: a.id,
                    reason: a.reason,
                    moderator: a.moderator,
                    date: a.date,
                    removed: true,
                }
                user.warns.splice(warnIndex, 1, b);
                console.log(user.warns)
                user.save();
                embed.setDescription(`warn removed from ${targetUser}`);
                embed.addFields({name: `id`, value: `${warn.id}`})
            }
        });

        await interaction.editReply({embeds: [embed]});
    }
}