import { getWeekday, getEmojiArray } from './utils.js';
import { config } from './config.js';

const { timeout: TIMEOUT, max_reactions: MAX_REACTIONS } = config;

export const commands = {
	'poke': (args) => poke(args),
	'ansage': (args) => ansage(args),
	'plündern': (args) => plündern(args),
};

const poke = (msg) => {
	msg.channel.send('FASS MICH NICHT AN!');
};

const ansage = (msg) => {
	msg.channel.send(
		'Jetzt hört mal zu ihr Lachsnacken!\n' +
		'Seid ihr es auch immer Leid, für so eine olle Abstimmung die ganzen Tage einzutragen?\n' +
		'Naja, dafür bin ich ja jetzt da!\n' +
		'Also. \n' +
		'Ab sofort könnt ihr mit `!plündern` die Abstimmung für die nächste Beutefahrt starten.\n' +
		'Klingt das gut? \n' +
		'Na dann ab auf Deck!',
	);
};

const plündern = (msg) => {
	const emotes = getEmojiArray(msg.guild.emojis, 7);
	console.log(emotes);
	msg.channel.send(getPollText(msg, emotes))
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
};

const ReactionCollector = (message) => {
	const filter = (reaction, user) => user.id != message.author.id;
	const collector = message.createReactionCollector(filter, { time: TIMEOUT, errors: ['time'] });

	collector.on('collect', collected => {
		if (collected.count === MAX_REACTIONS) {
			message.channel.send(`Aye! Die Raubfahrt wird vorgemerkt (${message.emojis.cache.get(collected.emoji.id)}) !`);
		}
	});

	collector.on('end', () => {
		message.channel.send('Zeit ist Rum! Ab jetzt wird die Abstimmung nicht mehr überwacht! Ihr seid nun auf euch alleine gestellt.');
		console.log('Abstimmung endet');
	});
};

const getPollText = (msg, emotes) => {
	const init = 'Ahoi, ihr Leichtmatrosen! Wann soll der nächste Raubzug starten?\n';

	let poll = '';
	emotes.forEach((emote, i) => poll += `${msg.guild.emojis.cache.get(emote)} - ${getWeekday(i)}\n`);
	// there must be a more elegant way for this

	return init + poll;
};
