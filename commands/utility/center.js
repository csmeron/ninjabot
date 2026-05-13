const { SlashCommandBuilder, Guild } = require('discord.js');
let server = '';
if (Guild.name.endsWith('press)')) {
  server = 'Spring-Cypress';
} else {
  server = 'Spring-Rayford';
}

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder().setName('center').setDescription('Which center is this server for?'),
  async execute(interaction) {
    await interaction.reply(`This is the server for the ${server} center!`);
  },
};
