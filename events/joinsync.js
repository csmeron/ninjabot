const { Events } = require('discord.js');
const client = require('../index.js');
// console.log(client);
module.exports = {
  name: Events.MessageReactionAdd,
  async execute(reaction, user) {
    console.log('reaction event fired');
    const dev1 = await client.channels.fetch('1504344481489489920');
    const dev2 = await client.channels.fetch('1504344463126822943');
    await dev1.send('confirmed');
    await dev2.send('confirmed');
  },
};
