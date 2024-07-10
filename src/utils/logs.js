const Guild = require("../models/Guild");
const { EmbedBuilder, Events, embedLength } = require("discord.js");

function handleLogs(client) {
  function send_log(guildId, embed) {
    Guild.findOne({ guildId: guildId }, (err, data) => {
      if (!data || !data.modlogs) return;
      const channel = client.channels.cache.get(data.modlogs);

      if (!channel) return;
      embed.setTimestamp();
      embed.setColor(0x0099ff);

      try {
        channel.send({ embeds: [embed] });
      } catch (error) {
        console.log(`Error while logging \n ${error}`);
      }
    });
  }

  client.on("MessageDelete", function (message) {
    try {
      if (message.guild === null) return;
      if (message.author.bot) return;

      const embed = new EmbedBuilder()
        .setTitle("Message Deleted")
        .addFields({
          name: "Author",
          value: `<@${message.author.id}> - ${message.author.tag}`,
        })
        .addFields({
          name: "Deleted Message",
          value: `${message.content}`,
        })
        .addFields({
          name: "Channel",
          value: `${message.channel}`,
        })
        .setTimestamp();

      return send_log(message.guild.id, embed);
    } catch (e) {
      console.log(`Error with MessageDelete event \n${e}`);
      return;
    }
  });

  client.on(Events.ChannelUpdate, (old, newe) => {
    try {
      if (newe.guild === null) return;
      const embed = new EmbedBuilder()
        .setTimestamp()
        .setTitle("Channel updated")
        .addFields({ name: "Channel", value: `${newe}` })
        .addFields({
          name: "Changes",
          value: "Channel's Permissions/name were updated",
        });

      console.log(newe, old);
      return send_log(old.guild.id, embed);
    } catch (error) {
      console.log(`Error with guildChannelPermissionUpdate event \n${error}`);
      return;
    }
  });

  client.on("guildMemberBoost", (member) => {
    try {
      if (member.guild === null) return;
      const embed = new EmbedBuilder()
        .setTimestamp()
        .setTitle("Member Boosted this server")
        .addFields({
          name: "Member",
          value: `<@${member.id}> - ${member.user.tag}`,
        })
        .addFields({
          name: "Boost Count",
          value: `${member.premiumSince?.toISOString()}`,
        });
      return send_log(member.guild.id, embed);
    } catch (error) {
      console.log(`Error with guildMemberBoost event \n${error}`);
      return;
    }
  });

  client.on("guildMemberUnBoost", (member) => {
    try {
      if (member.guild === null) return;
      const embed = new EmbedBuilder()
        .setTimestamp()
        .setTitle("Member Stopped Boosting this server")
        .addFields({
          name: "Member",
          value: `<@${member.id}> - ${member.user.tag}`,
        });
      return send_log(member.guild.id, embed);
    } catch (error) {
      console.log(`Error with guildMemberBoost event \n${error}`);
      return;
    }
  });

  client.on("guildMemberRoleAdd", (member, role) => {
    try {
      if (member.guild === null) return;
      const embed = new EmbedBuilder()
        .setTimestamp()
        .setTitle("Member was given a role")
        .addFields({
          name: "Member",
          value: `<@${member.id}> - ${member.user.tag}`,
        })
        .addFields({
          name: "Role Added",
          value: `${role}`,
        });
      return send_log(member.guild.id, embed);
    } catch (error) {
      console.log(`Error with guildMemberRoleAdd event \n${error}`);
      return;
    }
  });

  client.on("guildMemberRoleRemove", (member, role) => {
    try {
      if (member.guild === null) return;
      const embed = new EmbedBuilder()
        .setTimestamp()
        .setTitle("Member lost a role")
        .addFields({
          name: "Member",
          value: `<@${member.id}> - ${member.user.tag}`,
        })
        .addFields({
          name: "Role Removed",
          value: `${role}`,
        });
      return send_log(member.guild.id, embed);
    } catch (error) {
      console.log(`Error with guildMemberRoleRemove event \n${error}`);
      return;
    }
  });

  client.on("GuildMemberNicknameUpdate", (member, oldnickname, newnickname) => {
    try {
      if (member.guild === null) return;
      const embed = new EmbedBuilder()
        .setTimestamp()
        .setTitle("Member's nickname was updated")
        .addFields({
          name: "Member",
          value: `<@${member.id}> - ${member.user.tag}`,
        })
        .addFields({
          name: "Old Nickname",
          value: `${oldnickname}`,
        })
        .addFields({
          name: "New Nickname",
          value: `${newnickname}`,
        });
      return send_log(member.guild.id, embed);
    } catch (error) {
      console.log(`Error with GuildMemberNicknameUpdate event \n${error}`);
      return;
    }
  });
}

module.exports = { handleLogs };
