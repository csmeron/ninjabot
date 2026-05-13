// See events/ready.js for event format
const { Events, MessageFlags, Collection } = require('discord.js');

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

    // Proper class integration
    const { cooldowns } = interaction.client;

    // Verify whether collection already has an entry for this
    // command, and add new entry if not.
    if (!cooldowns.has(command.data.name)) {
      cooldowns.set(command.data.name, new Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.data.name);
    const defaultCooldownDuration = 3;
    const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1_000;

    if (timestamps.has(interaction.user.id)) {
      const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

      if (now < expirationTime) {
        const expiredTimestamp = Math.round(expirationTime / 1_000);
        return interaction.reply({
          content: `Please wait, you are on a cooldown for \`${command.data.name}\`. You can use it again at <t:${expiredTimestamp}:t> (<t:${expiredTimestamp}:R>).`,
          flags: MessageFlags.Ephemeral,
        });
      }
    }

    // Call the command's execute method and log errors that occur
    try {
      timestamps.set(interaction.user.id, now);
      setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
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
