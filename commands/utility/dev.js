const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('dev').setDescription('Who developed this bot?'),
  async execute(interaction) {
    await interaction.reply('<@617478275320643655>');
  },
};
