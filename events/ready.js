// Require the necessary Discord.js classes
const { Events } = require('discord.js');

module.exports = {
  name: Events.ClientReady, // Which event this file is for
  once: true, // Specifies that this event only runs once
  // event logic
  execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);
  },
};
