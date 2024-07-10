const Applications = require("../../models/Applications");
const ApplicationData = require("../../models/ApplicationData");
const {
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");

module.exports = async (client, interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId.startsWith("apply_")) {
    const stappl = await Applications.findOne({
      guildId: interaction.guild.id,
    });

    if (!stappl || !stappl.Applications) return;

    let application;

    for (const app of stappl.Applications) {
      if (
        app.title === interaction.customId.slice(6, interaction.customId.length)
      ) {
        application = app;
        break;
      }
    }

    if (await ApplicationData.findOne({ userId: interaction.user.id }))
      interaction.reply({
        content: "You've already applied before.",
        ephemeral: true,
      });

    interaction.reply({
      content: "Application started, Check your DMs.",
      ephemeral: true,
    });

    const user = interaction.user;
    const guildId = interaction.guild.id;
    const questionOptions = application.questions;
    const questions = questionOptions.map((option, index) => `${option}`);
    const answers = [];

    for (const question of questions) {
      const indexr = questions.indexOf(question);
      const filter = (response) => response.author.id === user.id;
      const questionEmbed = new EmbedBuilder()
        .setAuthor(
          interaction.guild,
          interaction.guild.iconURL({ format: "png", dynamic: true })
        )
        .addFields({
          name: `📜 Question \`[${indexr + 1}]\``,
          value: `\`\`\`${question}\`\`\``,
          inline: true,
        })
        .setThumbnail(
          interaction.guild.iconURL({ format: "png", dynamic: true })
        )
        .setColor(0x0099ff);

      await user.send({ embeds: [questionEmbed] });

      const collected = await user.dmChannel.awaitMessages({
        filter,
        max: 1,
      });
      const answer = collected.first().content;
      answers.push(answer);
    }

    const Embed = new EmbedBuilder().setDescription(
      `✅ Your application has been sent successfully!`
    );
    await user.send({ embeds: [Embed] });

    const applicationLogsChannelId = application.logChannel;
    if (!applicationLogsChannelId) return;

    const applicationLogsChannel = interaction.guild.channels.cache.get(
      applicationLogsChannelId
    );
    if (!applicationLogsChannel) return;

    const logEmbed = new EmbedBuilder()
      .setTitle("New Application")
      .setDescription("A new application has been submitted")
      .setThumbnail(interaction.user.displayAvatarURL())
      .addFields(
        { name: "User", value: `<@${user.id}>`, inline: true },
        {
          name: "Application name",
          value: `${application.title}`,
          inline: true,
        },
        {
          name: "Application Data",
          value: `<t:${Math.floor(Date.now() / 1000)}:R>`,
          inline: true,
        }
      )
      .setColor("#00ff00");

    for (const [index, question] of questions.entries()) {
      logEmbed.addFields({
        name: `Question \`[${index + 1}]\` ${question}`,
        value: `\`\`\`${answers[index]}\`\`\``,
      });
    }

    const acceptButton = new ButtonBuilder()
      .setCustomId(`accept_button${application.title}`)
      .setLabel("Accept")
      .setEmoji("✔")
      .setStyle(ButtonStyle.Success);

    const rejectButton = new ButtonBuilder()
      .setCustomId(`reject_button${application.title}`)
      .setEmoji("✖")
      .setLabel("Reject")
      .setStyle(ButtonStyle.Danger);

    const buttonRow = new ActionRowBuilder().addComponents(
      acceptButton,
      rejectButton
    );

    const logMessage = await applicationLogsChannel.send({
      embeds: [logEmbed],
      components: [buttonRow],
    });

    ApplicationData.findOneAndDelete({
      userId: user.id,
      message: logMessage.id,
    });
    var applicationData = new ApplicationData({
      userId: user.id,
      Answers: answers,
      message: logMessage.id,
    });
    await applicationData.save();
  } else if (
    interaction.customId.startsWith("accept_button") ||
    interaction.customId.startsWith("reject_button")
  ) {
    const dxt = await Applications.findOne({ guildId: interaction.guild.id });
    const applicationDataa = await ApplicationData.findOne({
      message: interaction.message.id,
    });
    console.log(applicationDataa);
    const usero = await client.users.fetch(applicationDataa.userId);
    const message = await interaction.channel.messages.fetch(
      applicationDataa.message
    );
    const adminName = interaction.user.id;

    let applicationn;

    for (const app of dxt.Applications) {
      console.log(interaction.customId);
      if (
        app.title ===
        interaction.customId.slice(13, interaction.customId.length)
      ) {
        applicationn = app;
        break;
      }
    }

    let statusEmoji, statusColor, statusDescription, statusDescription2;
    if (interaction.customId === `accept_button${applicationn.title}`) {
      statusEmoji = "✅";
      statusColor = "#00ff00";
      statusDescription = `Your application has been accepted! by <@${adminName}>`;
      statusDescription2 = `Application has been accepted! by <@${adminName}>`;
    } else if (interaction.customId === `reject_button${applicationn.title}`) {
      statusEmoji = "❌";
      statusColor = "#ff0000";
      statusDescription = `Your application has been rejected! by <@${adminName}>`;
      statusDescription2 = `Application has been rejected! by <@${adminName}>`;
    }
    const logEmbedo = new EmbedBuilder()
      .setAuthor(
        interaction.guild,
        interaction.guild.iconURL({ format: "png", dynamic: true })
      )
      .setTitle("Application")
      .setDescription(`${statusEmoji} ${statusDescription}`)
      .setColor(statusColor)
      .setThumbnail(usero.displayAvatarURL())
      .addFields(
        { name: "User", value: `<@${usero.id}>`, inline: true },
        {
          name: "Application name",
          value: `${applicationn.title}`,
          inline: true,
        },
        {
          name: "Application Data",
          value: `<t:${Math.floor(Date.now() / 1000)}:R>`,
          inline: true,
        }
      );

    const SlogEmbedo = new EmbedBuilder()
      .setAuthor(
        interaction.guild,
        interaction.guild.iconURL({ format: "png", dynamic: true })
      )
      .setTitle("Application")
      .setDescription(`${statusEmoji} ${statusDescription2}`)
      .setColor(statusColor)
      .setThumbnail(usero.displayAvatarURL())
      .addFields(
        { name: "User", value: `<@${usero.id}>`, inline: true },
        {
          name: "Application name",
          value: `${applicationn.title}`,
          inline: true,
        },
        {
          name: "Application Data",
          value: `<t:${Math.floor(Date.now() / 1000)}:R>`,
          inline: true,
        }
      );

    const questionso = dxt.questions;
    if (questionso && questionso.length > 0) {
      for (const question of questions) {
        const index = questionso.indexOf(question);
        const answer = applicationDataa.Answers[index];
        logEmbedo.addFields({
          name: `Question [${index + 1}] ${question}`,
          value: `\`\`\`Answer: ${answer}\`\`\``,
        });
      }
    }

    const acceptButtono = interaction.message.components[0].components.find(
      (button) => button.customId === `accept_button${applicationn.title}`
    );
    const rejectButtono = interaction.message.components[0].components.find(
      (button) => button.customId === `reject_button${applicationn.title}`
    );
    const logEmbeds = new EmbedBuilder()
      .setAuthor(
        interaction.guild,
        interaction.guild.iconURL({ format: "png", dynamic: true })
      )
      .setDescription(`${statusEmoji} ${statusDescription}`)
      .setColor(statusColor)
      .setTimestamp();

    const ergerd = new ButtonBuilder()
      .setCustomId("ert")
      .setLabel(`Sent from: ${interaction.guild.name}`)
      .setDisabled(true)
      .setStyle(ButtonStyle.Secondary);

    const ggds = new ActionRowBuilder().addComponents(ergerd);

    logEmbedo.setDescription(`${statusEmoji} ${statusDescription}`);
    await interaction.update({
      embeds: [SlogEmbedo],
      components: [],
    });
    await usero.send({ embeds: [logEmbeds], components: [ggds] });
  }
};
