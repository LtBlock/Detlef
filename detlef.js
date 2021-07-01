import dotenv from 'dotenv';
dotenv.config();
const token = process.env.TOKEN;

import Discord from 'discord.js';
const client = new Discord.Client();

import { commands } from './commands.js';
import { config } from './config.js';

const { prefix } = config;

client.once('ready', () => {
	console.log('Hello There!');
	console.log(commands);
});

client.on('message', (msg) => {
	if (!msg.content.startsWith(prefix)) return;

	// split test message into command and arguments => !poke me = command 'poke' with args 'me'
	const args = msg.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

	if (commands[command]) commands[command](msg);
});

client.on('error', (error) => {
	console.log('ALARM', error);
});

client.login(token);
