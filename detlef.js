const {prefix} = require('./config.json');
const dotenv = require('dotenv');
dotenv.config();
const token = process.env.TOKEN;

const Discord = require('discord.js');
const client = new Discord.Client();

client.once('ready', () => {
    console.log('Hello There!');
})

client.on('message', msg => {
    if(!msg.content.startsWith(prefix) || msg.author.bot) return;
    
    // split test message into command and arguments => !poke me = command 'poke' with args 'me'
    const args = msg.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if(command === 'poke') {
        msg.channel.send('FASS MICH NICHT AN!');
        if(args.length) msg.channel.send(`"${args}" \nverstehe ich nicht.`);
    } else if(command === 'react') {
        msg.react(getEmoji(msg.guild.emojis, "Uff"));
    }
})

client.login(token);

const getEmoji = (emojis, name) =>(emojis.cache.find(emoji => emoji.name === name));