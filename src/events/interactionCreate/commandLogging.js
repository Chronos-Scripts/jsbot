const { devs, testServer } = require("../../../config.json");
const getLocalCommands = require("../../utils/getLocalCommands");
const Guild = require("../../models/Guild");
const config = require("../../../config.json");
const { EmbedBuilder } = require("discord.js");

module.exports = async (client, interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const gu = await Guild.findOne({ guildId: interaction.guild.id });

  const localCommands = getLocalCommands();

  const commandObject = localCommands.find(
    (cmd) => cmd.name === interaction.commandName
  );

  if (!gu | !commandObject) return;

  let success = true;

  if (commandObject.permissionsRequired?.length) {
    for (const permission of commandObject.permissionsRequired) {
      if (!interaction.member.permissions.has(permission)) {
        success = false;
      }
    }
  }

  var cmd = interaction.commandName;
  var ch = gu.modlogs;
  if (!ch) return;
  var channel = await interaction.guild.channels.fetch(ch);
  if (channel) {
    const username =
      `<@${interaction.member.id}>` || interaction.member.user.username;
    const embed = new EmbedBuilder()
      .setTitle("⚠️ Command used ⚠️")
      .setColor(0x0099ff)
      .setTimestamp()
      .addFields(
        { name: "Command", value: `${cmd}` },
        { name: "UsedBy", value: `${username}/${interaction.member.id}` },
        {
          name: "Sucessful",
          value: `${success ? ":white_check_mark:" : ":x:"}`,
        }
      );

    await channel.send({ embeds: [embed] });
  }
};
