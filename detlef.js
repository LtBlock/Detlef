const { prefix } = require('./config.json');
const dotenv = require('dotenv');
dotenv.config();
const token = process.env.TOKEN;

const Discord = require('discord.js');
const client = new Discord.Client();

const TIMEOUT = 60 * 60 * 1000;
const MAX_REACTIONS = 5;

client.once('ready', () => {
	console.log('Hello There!');
});

client.on('message', (msg) => {
	if (!msg.content.startsWith(prefix)) return;

	// split test message into command and arguments => !poke me = command 'poke' with args 'me'
	const args = msg.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

	if (command === 'poke') {
		msg.channel.send('FASS MICH NICHT AN!');
		if (args.length) msg.channel.send(`"${args}" \nverstehe ich nicht.`);
	}
	else if (command === 'ansage') {
		msg.channel.send(
			'Jetzt hört mal zu ihr Lachsnacken!\n' +
			'Seid ihr es auch immer Leid, für so eine olle Abstimmung die ganzen Tage einzutragen?\n' +
			'Naja, dafür bin ich ja jetzt da!\n' +
			'Also. \n' +
			'Ab sofort könnt ihr mit `!plündern` die Abstimmung für die nächste Beutefahrt starten.\n' +
			'Klingt das gut? \n' +
			'Na dann ab auf Deck!',
		);
	}
	else if (command === 'plündern') {
		const emotes = getEmojiArray(msg.guild.emojis, 7);
		msg.channel.send(getPollText(emotes))
			.then(message => {
				emotes.forEach(async emote => {
					try {
						await message.react(emote);
					}
					catch (error) {
						console.log(error);
					}
				});
				ReactionCollector(message);
			})
			.catch(error => console.log(error));
	}
});

client.on('error', (error) => {
	console.log('ALARM', error);
});

client.login(token);

const ReactionCollector = (message) => {
	const filter = (reaction, user) => user.id != message.author.id;
	const collector = message.createReactionCollector(filter, { time: TIMEOUT, errors: ['time'] });

	collector.on('collect', collected => {
		if(collected.count === MAX_REACTIONS) {
			message.channel.send(`Aye! Die Raubfahrt wird vorgemerkt (${client.emojis.cache.get(collected.emoji.id)}) !`);
		}
	});

	collector.on('end', collected => {
		message.channel.send('Die Zeit ist rum! Ab jetzt wird die Abstimmung nicht mehr überwacht! Ihr seid nun auf euch alleine gestellt.');
		console.log('Abstimmung endet');
	});
};

// const getEmoji = (emojis, name) =>
// 	emojis.cache.find((emoji) => emoji.name === name);

const getEmojiArray = (emojis, length) => {
	const emotes = [...emojis.cache.keys()];

	const emoteArray = [length];
	for (let i = 0; i < length; i++) {
		const rnd = Math.round(Math.random() * (emotes.length - 1));
		emoteArray[i] = emotes.splice(rnd, 1)[0];
	}

	return emoteArray;
};

const getWeekday = (i) => {
	const weekdays = [
		'Montag',
		'Dienstag',
		'Mittwoch',
		'Donnerstag',
		'Freitag',
		'Samstag',
		'Sonntag',
	];
	return weekdays[i];
};

const getPollText = (emotes) => {
	const init = 'Ahoi, ihr Leichtmatrosen! Wann soll der nächste Raubzug starten?\n';

	let poll = '';
	emotes.forEach((emote, i) => poll += `${client.emojis.cache.get(emote)} - ${getWeekday(i)}\n`);
	// there must be a more elegant way for this

	return init + poll;
};

