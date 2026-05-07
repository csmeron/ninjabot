const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder().setName('center').setDescription('Which center is this server for?'),
  async execute(interaction) {
    await interaction.reply('idk');
  },
};
