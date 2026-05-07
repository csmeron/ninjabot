// See events/ready.js for event format
const { Events, MessageFlags } = require('discord.js');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    // Ignore if interaction is not a command
    if (!interaction.isChatInputCommand()) return;
    // Get matching commands based off interaction.commandName
    const command = interaction.client.commands.get(interaction.commandName);

    // If no command found, log an error
    if (!command) {
      console.error(`No command matching ${interaction.commandName} was found`);
      return;
    }

    // Call the command's execute method and log errors that occur
    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: 'There was an error while executing this command!',
          flags: MessageFlags.Ephemeral,
        });
      } else {
        await interaction.reply({
          content: 'There was an error while executing this command!',
          flags: MessageFlags.Ephemeral,
        });
      }
    }
  },
};
