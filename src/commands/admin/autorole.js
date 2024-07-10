const {
  ApplicationCommandOptionType,
  Client,
  Interaction,
  PermissionFlagsBits,
} = require("discord.js");
let Guild = require("../../models/Guild");

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    if (!interaction.inGuild()) {
      interaction.reply("You can only run this command inside a server.");
      return;
    }

    const sub = interaction.options.getSubcommand();

    switch (sub) {
      case "enable":
        const targetRoleId = interaction.options.getRole("role")?.value;

        try {
          await interaction.deferReply();

          let guild = await Guild.findOne({ guildId: interaction.guild.id });

          if (guild) {
            if (guild.roleId === targetRoleId) {
              interaction.editReply(
                "Auto role has already been configured for that role. To disable run `/autorole-disable`"
              );
              return;
            }

            guild.modlogs = targetRoleId;
          } else {
            guild = new Guild({
              guildId: interaction.guild.id,
            });

            guild.autorole = targetRoleId;
          }

          await guild.save();
          interaction.editReply(
            "Autorole has now been configured. To disable run `/autorole-disable`"
          );
        } catch (error) {
          console.log(error);
        }
        break;
      case "disable":
        try {
          await interaction.deferReply();

          if (!(await Guild.exists({ guildId: interaction.guild.id }))) {
            interaction.editReply(
              "Auto role has not been configured for this server. Use `/autorole-configure` to set it up."
            );
            return;
          }

          let guild = await Guild.findOne({ guildId: interaction.guild.id });
          guild.autorole = "0x";
          guild.save();
          interaction.editReply(
            "Auto role has been disabled for this server. Use `/autorole-configure` to set it up again."
          );
        } catch (error) {
          console.log(error);
        }
        break;
    }
  },

  name: "autorole",
  description: "Configure your auto-role for this server.",
  options: [
    {
      name: "enable",
      description: "The role you want users to get on join.",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "role",
          description: "The role you want users to get on join.",
          type: ApplicationCommandOptionType.Role,
          required: true,
        },
      ],
    },

    {
      name: "disable",
      description: "Disable the auto-role for this server.",
      type: ApplicationCommandOptionType.Subcommand,
    },
  ],
  enabled: true,
  permissionsRequired: [PermissionFlagsBits.Administrator],
  botPermissions: [PermissionFlagsBits.ManageRoles],
};
