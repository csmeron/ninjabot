const { Events } = require('discord.js');
const client = require('../index.js');
// console.log(client);
module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member) {
    // verify event occurring
    console.log('Member Join Detected');
    // fetch appropriate log channels
    const dev1 = await client.channels.fetch('1504344481489489920');
    const dev2 = await client.channels.fetch('1504344463126822943');
    // log new user's tag (user#1234), displayname (nickname), and flakeid
    const newUserTag = member.user.tag;
    const newUserNick = member.displayName;
    const newUserSnowflake = member.id;

    // verify which center server they joined
    let center = '';
    if (member.guild.name.endsWith('press)')) {
      center = 'Spring-Cypress';
    } else if (member.guild.name.endsWith('ev2')) {
      center = 'Spring-Rayford';
    }

    // send confirmation message
    await dev1.send(`${newUserNick} has joined the ${center} server. `);
    await dev1.send(`${newUserNick} has joined the ${center} server. `);
  },
};
