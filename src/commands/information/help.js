const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  PermissionsBitField,
  GuildBanManager,
  GuildBan,
  EmbedBuilder,
  StringSelectMenuBuilder,
  ActionRowBuilder,
} = require("discord.js");
const config = require("../../../config");
const fs = require("fs");

module.exports = {
  name: "help",
  description: "help command",
  options: [
    {
      name: "command",
      type: ApplicationCommandOptionType.String,
      description: "The command you want help with",
      required: false,
    },
  ],
  enabled: true,
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */

  callback: async (client, interaction) => {
    const cmdName = interaction.options.getString("command") || 0;

    if (cmdName === 0) {
      const commandFolders = fs
        .readdirSync("./src/commands")
        .filter((folder) => !folder.endsWith("."));
      const commandByCategory = {};

      for (const folder of commandFolders) {
        const commandFiles = fs
          .readdirSync(`./src/commands/${folder}`)
          .filter((file) => file.endsWith(".js"));
        const commands = [];

        for (const file of commandFiles) {
          const { default: command } = await import(`./../${folder}/${file}`);
          commands.push({
            name: command.name,
            description: command.description,
          });
        }

        commandByCategory[folder] = commands;
      }
      await interaction.deferReply();

      const DropdownOptions = Object.keys(commandByCategory).map((folder) => ({
        label: folder,
        value: folder,
      }));

      const SelectMenu = new StringSelectMenuBuilder()
        .setCustomId("category-select")
        .setPlaceholder("Select a category")
        .addOptions(
          ...DropdownOptions.map((option) => ({
            label: option.label.charAt(0).toUpperCase() + option.label.slice(1),
            value: option.value.charAt(0).toUpperCase() + option.value.slice(1),
          }))
        );

      const embed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle("Help menu")
        .setDescription(
          "Select a category from the dropdown menu to view commands."
        )
        .setThumbnail(client.user.displayAvatarURL())
        .setTimestamp();

      const row = new ActionRowBuilder().addComponents(SelectMenu);
      const message = await interaction.editReply({
        embeds: [embed],
        components: [row],
      });

      const filter = (i) =>
        i.isStringSelectMenu() && i.CustomId === "category-select";
      const collector = message.createMessageComponentCollector(filter);

      collector.on("collect", async (i) => {
        const category = i.values[0];
        const categoryCommands =
          commandByCategory[
            i.values[0].charAt(0).toLowerCase() + i.values[0].slice(1)
          ];

        const categoryEmbed = new EmbedBuilder()
          .setColor(0x0099ff)
          .setTitle(
            `${category.charAt(0).toUpperCase() + category.slice(1)} Commands`
          )
          .setDescription(`List of all the commands in this category`)
          .setThumbnail(client.user.displayAvatarURL())
          .setFooter({ text: "Bot made by chronos" })
          .setTimestamp();

        if (!categoryCommands == []) {
          categoryEmbed.addFields(
            categoryCommands.map((command) => ({
              name: command.name,
              value: command.description,
            }))
          );
        }

        await i.update({ embeds: [categoryEmbed] });
      });
    } else {
      var found = false;
      const commandFolders = fs
        .readdirSync("./src/commands")
        .filter((folder) => !folder.endsWith("."));

      for (const folder of commandFolders) {
        const commandFiles = fs
          .readdirSync(`./src/commands/${folder}`)
          .filter((file) => file.endsWith(".js"));

        for (const file of commandFiles) {
          const { default: cd } = await import(`./../${folder}/${file}`);
          var perm = [];
          if (cd.name === cmdName) {
            for (const [name, val] of Object.entries(PermissionFlagsBits)) {
              for (const c of cd.permissionsRequired) {
                if (c === val) perm.push(name);
              }
            }
            found = true;
            let str = "";
            for (const [p, val] of Object.entries(perm)) {
              str += `${val}\n`;
            }
            const embed = new EmbedBuilder()
              .setColor(0x0099ff)
              .setTitle(cd.name)
              .setDescription(cd.description)
              .setThumbnail(client.user.displayAvatarURL())
              .setTimestamp()
              .addFields({
                name: "Permissions",
                value: str || "No permissions needed for this command.",
              })
              .addFields({ name: "Options", value: "none" });
            interaction.reply({ embeds: [embed] });
          }
        }
      }
    }
  },
};
