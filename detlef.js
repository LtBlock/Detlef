const dotenv = require('dotenv');
dotenv.config();
const { version } = require('./package.json');

const Discord = require('discord.js');
const client = new Discord.Client();

const { commands } = require('./commands.js');
const { prefix } = require('./config.json');

client.once('ready', () => {
	console.log('Hello There!');
	client.user.setUsername(`Detlef v${version}`)
		.then(user => console.log(`Detlef running as User '${user.username}'`))
		.catch(console.error);
	client.user.setPresence({ activity: { name: 'dem Pöbel', type: 'LISTENING' }, status: 'Don\'t !poke me!' })
		.then(presence => console.log('Status and Activity ready!'))
		.catch(console.error);
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

client.login(process.env.TOKEN);
