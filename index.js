// Load Node's file system and path util modules
const fs = require('node:fs');
const path = require('node:path');

// Require the necessary Discord.js classes and the bot's token
const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');
const { token } = require('./config.json');


// Create a new client instance
// `GatewayIntentBits.Guilds` ensures caches are populated and available
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once)
client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// Log in to Discord with the client token
client.login(token);


// Create a collection to track commands
client.commands = new Collection();

// foldersPath scans for command categories, commandFolders
// checks for command files in said paths
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

// For each command file detected, add them to the command collection
for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection with the key as the cmd name and the value as the exported module
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
    }
    else {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }
}

client.on(Events.InteractionCreate, async (interaction) => {
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
});
