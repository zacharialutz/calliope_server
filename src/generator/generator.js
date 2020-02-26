'use strict';

const WordService = require('./word-service');

// Returns a random integer from 1 to (num)
function roll(num) {
	return Math.floor((Math.random() * num)) + 1;
}

// Picks a random item from an array
function getOne(arr) {
	const roll = Math.floor((Math.random() * arr.length));
	return arr[roll];
}

// Turns 'a' into 'an' if input starts with a vowel
function a(str) {
	const edgeCases = ['uniq', 'one-'];
	const vowels = ['a', 'e', 'i', 'o', 'u'];
	if (vowels.includes(str.charAt(0)) && !edgeCases.includes(str.slice(0, 4))) return `an ${str}`;
	else return `a ${str}`;
}

// Generates a genre
async function makeGenre(db, filter) {
	let genre = '';
	await WordService.getNoun(
		db, 'singular', 'genre', filter
	)
		.then(val => genre = val);
	return genre;
}

// Generates an adjective
async function makeAdj(db, cat, filter) {
	let adj = '';
	if (roll(4) === 1 && cat === 'animate') {
		await WordService.getVerb(
			db, 'gerund', filter
		)
			.then(val => adj = val);
	}
	else {
		if (roll(4) === 1) await WordService.getModifier(
			db, cat, filter
		)
			.then(val => adj = `${val} `);

		await WordService.getAdjective(
			db, cat, filter
		)
			.then(val => adj += val);
	}
	return adj;
}

// Generates a material
async function makeMaterial(db, filter) {
	let material = '';
	await WordService.getNoun(
		db, 'singular', 'substance', filter
	)
		.then(val => material = val);
	return material;
}

// Generates a group - obj is either 'group' or 'container'
async function makeGroup(db, obj, filter) {
	let group = '';
	await WordService.getNoun(
		db, 'singular', obj, filter
	)
		.then(val => group = val);
	return group;
}

// Generates a character with an adjective
async function makeCharacter(db, filter) {
	let character = '';
	let multi = 'singular';
	if (roll(3) === 1) {
		multi = 'plural';
		character = `${await makeGroup(db, 'group', filter)} of `;
	}

	if (roll(3) === 1) character += await makeAdj(db, 'general', filter);
	else character += await makeAdj(db, 'animate', filter);

	await WordService.getNoun(
		db, multi, 'animate', filter
	)
		.then(val => character += ` ${val}`);

	if (roll(3) === 1) {
		switch (roll(2)) {
			case 1:
				const addon = getOne([
					'ignorant to the ways of',
					'well-experienced with',
					'unaware of',
					'skilled with',
					'well-educated on the subject of',
					'obsessed with',
					'preoccupied with',
					'indifferent to',
					'afraid of',
					'terrified of',
					'triggered by',
					'enamoured with',
					'curious about',
					'useless with',
					'excellent with',
					'offended by',
					'easily influenced by',
					'infatuated with',
					'beset by nightmares of',
					'allergic to',
					'familiar with',
					'unfamiliar with',
					'comfortable with',
					'uncomfortable with',
					'against',
					'supportive of',
					'suspicious of'
				]);

				let subj = '';
				switch (roll(6)) {
					case 1:
						await WordService.getNoun(
							db, 'singular', 'abstract', filter
						)
							.then(val => subj = `${val}`);
						break;
					case 2:
						await WordService.getNoun(
							db, 'plural', 'animate', filter
						)
							.then(val => subj = `${val}`);
						break;
					case 3:
						await WordService.getNoun(
							db, 'plural', 'object', filter
						)
							.then(val => subj = `${val}`);
						break;
					case 4:
						await WordService.getNoun(
							db, 'singular', 'substance', filter
						)
							.then(val => subj = `${val}`);
						break;
					case 5:
						await WordService.getNoun(
							db, 'plural', 'setting', filter
						)
							.then(val => subj = `${val}`);
						break;
					case 6:
						await WordService.getVerb(
							db, 'gerund', filter
						)
							.then(val => subj = `${val}`);
				}

				let toBe = '';
				(multi === 'singular') ? toBe = 'is' : toBe = 'are';

				character += ` who ${toBe} ${addon} ${subj}`;
				break;
			case 2:
				let someVerb = '';
				let tense = '';
				(multi === 'singular') ? tense = 'present' : tense = 'infinitive';

				// Make verb with potential adverb
				await WordService.getVerb(
					db, tense, filter
				)
					.then(val => someVerb = `${val}`);
				if (roll(2) === 1) {
					await WordService.getAdjective(
						db, 'adverb', filter
					)
						.then(val => someVerb += ` ${val}`);
				}

				let freq = '';
				let spacer = '';
				if (roll(2) === 1) {
					spacer = ' ';
					freq = getOne([
						'once in a while',
						'far too often',
						'several times a day',
						'every night',
						'in the middle of the night',
						'several times a week',
						'several times a month',
						'several times a year',
						'every day',
						'every few days',
						'once a week',
						'every few weeks',
						'once a month',
						'every few months',
						'once a year',
						'every few years',
						'on occasion',
						'when the time is right',
						'when no one is watching',
						'from time to time',
						'every now and then',
						'whenever possible',
						'just for fun',
						'when in a mood',
						'just to show off',
						'for no particular reason',
						'obsessively',
						'all the time',
						'to calm down',
						'for work',
						'on company time',
						'in secret'
					]);
				}

				character += ` who ${someVerb}${spacer}${freq}`;
		}
	}

	return a(character);
}

// Generates an object with an adjective
async function makeObject(db, filter) {
	let object = '';
	let multi = 'singular';
	if (roll(3) === 1) {
		multi = 'plural';
		const holds = getOne([
			'of',
			'full of',
			'containing',
			'stuffed with',
			'filled with',
			'packed with',
			'containing several',
			'which once contained',
			'meant to hold',
			'crammed with',
			'partially filled with'
		]);
		object = `${await makeGroup(db, 'container', filter)} ${holds} `;
	}

	if (roll(3) === 1) object += await makeAdj(db, 'general', filter);
	else object += await makeAdj(db, 'object', filter);

	await WordService.getNoun(
		db, multi, 'object', filter
	)
		.then(val => object += ` ${val}`);

	const part = getOne([
		'made mostly out of',
		'made entirely of',
		'covered in',
		'coated in',
		'decorated with',
		'made of',
		'made partly from',
		'made from pure',
		'apparantly made of',
		'fashioned from',
		'embellished with',
		'adorned with',
		'made to resemble',
		'made from what appears to be',
		'covered in what appears to be'
	]);
	if (roll(3) === 1) object += ` ${part} ${await makeMaterial(db, filter)}`;

	return a(object);
}

// Generates either a named location or a setting with adjective
async function makeSetting(db, filter) {
	let setting;
	let settingPrep = 'in';
	if (roll(3) === 1) {
		await WordService.getSetting(
			db, 'location', filter
		)
			.then(val => {
				setting = val[0];
				if (val[1]) settingPrep = val[1];
			});
	}
	else {
		if (roll(3) === 1) setting = await makeAdj(db, 'general', filter);
		else setting = await makeAdj(db, 'place', filter);

		await WordService.getSetting(
			db, 'setting', filter
		)
			.then(val => {
				setting += ` ${val[0]}`;
				setting = a(setting);
				if (val[1]) settingPrep = val[1];
			});
	}

	return { setting, settingPrep };
}

// Generates a time setting
async function makePeriod(db, filter) {
	let period;
	await WordService.getNoun(
		db, 'singular', 'period', filter
	)
		.then(val => period = val);

	return period;
}

// Generates a plot twist
async function makeTwist(db, filter) {
	const part1 = getOne([
		'Everything changes when',
		'The plot thickens when',
		'Suddenly,',
		'The plot twist occurs when',
		'Eventually,',
		'Everything falls apart when',
		'Everything comes together when',
		'All of a sudden,',
		'At some point',
		'Surprisingly,',
		'Not surprisingly,',
		'Things get exciting when',
		'Things get interesting when',
		'Trouble begins when',
		'Everything calms down when',
		'A solution is needed when',
		'A dillema arises when',
		'To everyone\'s surprise,',
		'To no one\'s surprise,',
		'All of a sudden,',
		'Unexpectedly,',
		'As expected,',
		'As one might expect,',
		'Luckily,',
		'Fortunately,',
		'Unfortunately,',
		'Nothing is ever the same again once',
		'In the end,',
		'For some reason,',
		'For reasons unexplained,',
		'Goals are achieved when',
		'Dreams are realized when',
		'Dreams are shattered when',
		'In a bizarre twist of fate,',
		'Incidentally,',
		'Ironically,',
		'Somehow',
		'Coincidentally,',
		'Once again,',
		'Through no fault of their own,',
		'Against everyone\'s wishes,'
	]);

	let subject;
	if (roll(2) === 1) subject = await makeCharacter(db, filter);
	else subject = await makeObject(db, filter);

	const part2 = getOne([
		'is found',
		'is rediscovered',
		'disappears',
		'appears',
		'gets lost',
		'turns up',
		'is revealed to be something else entirely',
		'becomes involved',
		'is removed from the situation',
		'becomes a problem',
		'is no longer a problem',
		'becomes the center of attention',
		'becomes necessary',
		'is no longer involved',
		'is no longer necessary',
		'becomes critically important',
		'is no longer important',
		'is nowhere to be found',
		'goes missing',
		'finds a purpose',
		'is no longer wanted',
		'no longer has a purpose',
		'becomes hidden'
	]);

	return `${part1} ${subject} ${part2}.`;
}

// Generates items to insert into modular template
async function template(db, filter) {
	const genre = await makeGenre(db, filter);
	const char1 = await makeCharacter(db, filter);
	const { setting, settingPrep } = await makeSetting(db, filter);
	const period = await makePeriod(db, filter);
	const twist = await makeTwist(db, filter);
	let char2 = '';
	if (roll(3) === 1) char2 = ` and ${await makeCharacter(db, filter)}`;

	const isAbout = getOne([
		'is about',
		'features',
		'involves',
		'is centered on',
		'revolves around',
		'focuses on',
		'depicts',
		'portrays',
		'stars',
		'regards'
	]);
	const takesPlace = getOne([
		'It takes place',
		'It starts',
		'It opens',
		'It begins',
		'Everything happens',
		'It ends',
		'The climax takes place',
		'Most of it occurs',
		'The beginning takes place',
		'The ending takes place',
		'An important event occurs'
	]);

	// Time and place setting
	let middle = '';
	switch (roll(3)) {
		case 1:
			middle = `${takesPlace} ${settingPrep} ${setting} during ${period}.`;
			break;
		case 2:
			middle = `${takesPlace} ${settingPrep} ${setting}.`;
			break;
		case 3:
			middle = `${takesPlace} during ${period}.`;
	}

	// Fills in template to create story
	return `This ${genre} ${isAbout} ${char1}${char2}. ${middle} ${twist}`;
}

// Returns array of stories
async function generate(db, num = 1, filter) {
	let list = [];
	for (let i = 0; i < num; i++) {
		await template(db, filter).then(story => list.push(story));
	}
	return list;
}

module.exports = { generate };