const {
  Client,
  Interaction,
  PermissionFlagsBits,
  ApplicationCommandOptionType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const Applications = require("../../models/Applications");

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    const sub = interaction.options.getSubcommand();
    var stappl = await Applications.findOne({ guildId: interaction.guild.id });

    switch (sub) {
      case "setup":
        const channel = interaction.options.getChannel("channel");
        const logChannel = interaction.options.getChannel("log-channel");
        const title = interaction.options.getString("title");
        const questionOptions = interaction.options
          .getString("questions")
          .split("/")
          .map((option) => option.trim());
        const questions = questionOptions.map(
          (option, index) => `Question ${index + 1}: ${option}`
        );

        if (!stappl) {
          stappl = new Applications({
            guildId: interaction.guild.id,
            Applications: [
              {
                title: title,
                questions: questionOptions,
                logChannel: logChannel.id,
              },
            ],
          });
        } else {
          stappl.Applications.push({
            title: title,
            questions: questionOptions,
            logChannel: logChannel.id,
          });
        }

        await stappl.save();

        const setupEmbed = new EmbedBuilder()
          .setTitle(`${title} setup`)
          .setDescription(`**${title}** has been setup successfully.`)
          .addFields({ name: "Channel", value: channel.toString() })
          .addFields({
            name: "Application Logs Channel",
            value: logChannel.toString(),
          })
          .addFields({
            name: "📜 Questions",
            value: questions.join("\n"),
          })
          .setColor(0x0099ff);

        const ApplyEmbed = new EmbedBuilder()
          .setColor(0x0099ff)
          .setTitle(`${title}`)
          .setThumbnail(
            interaction.guild.iconURL({ format: "png", dynamic: true })
          )
          .setDescription('\nClick the "Apply" button to apply');
        const applyButton = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId(`apply_${title}`)
            .setEmoji("<:zfrzegerh:1153541488530182185>")
            .setStyle(ButtonStyle.Primary)
            .setLabel("Apply")
        );

        await logChannel.send({
          embeds: [setupEmbed],
        });
        await interaction.reply({
          embeds: [ApplyEmbed],
          components: [applyButton],
        });
        break;
    }
  },

  name: "applications",
  description: "applications in this server.",
  permissionsRequired: [PermissionFlagsBits.Administrator],
  options: [
    {
      name: "setup",
      description: "Setup a new application for this server.",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "channel",
          description: "The channel you want applications to be in.",
          type: ApplicationCommandOptionType.Channel,
          required: true,
        },

        {
          name: "log-channel",
          description: "The channel you want applications to be logged in.",
          type: ApplicationCommandOptionType.Channel,
          required: true,
        },

        {
          name: "title",
          description: "The title of the application form.",
          type: ApplicationCommandOptionType.String,
          required: true,
        },

        {
          name: "questions",
          description:
            "The questions you want to ask in the application form, Seperate them using '/' .",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
    },
  ],
  enabled: true,
};
