// Require necesary discord.js classes
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reload')
    .setDescription('Reloads a command.')
    .addStringOption((option) => option.setName('command').setDescription('The command to reload.').setRequired(true)),
  async execute(interaction) {
    const commandName = interaction.options.getString('command', true).toLowerCase();
    const command = interaction.client.commands.get(commandName);

    if (!command) {
      return interaction.reply(`There is no command with the name \`${commandName}\`!`);
    }

    // Get the file path from require.cache
    const commandFilePath = Object.keys(require.cache).find(
      (path) => require.cache[path].exports === command,
    );

    if (!commandFilePath) {
      return interaction.reply(`Could not find the file path for command \`${commandName}\`!`);
    }

    delete require.cache[commandFilePath];

    try {
      const newCommand = require(commandFilePath);
      interaction.client.commands.set(newCommand.data.name, newCommand);
      await interaction.reply(`Command \`${newCommand.data.name}\` was reloaded!`);
    } catch (error) {
      console.error(error);
      await interaction.reply(
        `There was an error while reloading a command \`${command.data.name}\`:\n\`${error.message}\``,
      );
    }
  },
};
