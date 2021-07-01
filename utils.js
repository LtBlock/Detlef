export const getWeekday = (i) => {
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

export const getEmojiArray = (emojis, length) => {
	const emotes = [...emojis.cache.keys()];

	const emoteArray = [length];
	for (let i = 0; i < length; i++) {
		const rnd = Math.round(Math.random() * (emotes.length - 1));
		emoteArray[i] = emotes.splice(rnd, 1)[0];
	}

	return emoteArray;
};