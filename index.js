// Load Node's file system and path util modules
const fs = require('node:fs');
const path = require('node:path');

// Require the necessary Discord.js classes and the bot's token
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { token } = require('./config.json');


// Create a new client instance
// `GatewayIntentBits.Guilds` ensures caches are populated and available
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
  ],
});
module.exports = client; // export for usage in other files

// Create a collection to track commands,
// as well as one for cooldowns.
client.commands = new Collection();
client.cooldowns = new Collection();
// foldersPath scans for command categories, commandFolders
// checks for command files in said paths
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);
// For each command file detected, add them to the command collection
for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
  for (const file of commandFiles) {
    console.log('Loading command file: ', file);
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

// Event Handler, functions more or less
// the same as the command handler.
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith('.js'));

for (const file of eventFiles) {
  console.log('Loading event file: ', file);
  const filePath = path.join(eventsPath, file);
  try {
    const event = require(filePath);
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args));
    } else {
      client.on(event.name, (...args) => event.execute(...args));
    }
    console.log(`Registered event: ${event.name}`);
  } catch (err) {
    console.error(`Failed to load event ${file}:`, err);
  }
}


// Log in to Discord with the client token
client.login(token);
