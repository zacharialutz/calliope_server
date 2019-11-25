const WordService = require('./word-service')

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
	const vowels = ['a', 'e', 'i', 'o', 'u'];
	if (vowels.includes(str.charAt(0))) return `an ${str}`;
	else return `a ${str}`;
}

// Generates a genre
async function makeGenre(db, filter) {
	let genre;
	await WordService.getNoun(
		db, 'singular', 'genre', filter
	)
		.then(val => genre = val);
	return genre;
}

// Generates an adjective
async function makeAdj(db, cat, filter) {
	let adj = '';
	if (roll(3) === 1) await WordService.getModifier(
		db, cat, filter
	)
		.then(val => adj = `${val} `);

	await WordService.getAdjective(
		db, cat, filter
	)
		.then(val => adj += val);
	return adj;
}

// Generates a material
async function makeMaterial(db, filter) {
	let material;
	await WordService.getNoun(
		db, 'singular', 'substance', filter
	)
		.then(val => material = val);
	return material;
}

// Generates a group - obj is either 'group' or 'container'
async function makeGroup(db, obj, filter) {
	let group;
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
	character = a(character);
	return character;
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
			'filled with'
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
		'made of solid',
		'made entirely of',
		'covered in',
		'decorated with',
		'made of',
		'partly made from',
		'appearing to be made of',
		'fashioned from'
	]);
	if (roll(3) === 1) object += ` ${part} ${await makeMaterial(db, filter)}`;

	object = a(object);
	return object;
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
		'Things get exciting when',
		'Things get interesting when',
		'Trouble begins when',
		'Everything calms down when',
		'A solution is found when',
		'A solution is needed when',
		'A dillema arises when',
		'To everyone\' surprise,',
		'All of a sudden,',
		'Unexpectedly,',
		'As one might expect,',
		'Fortunately,',
		'Unfortunately,',
		'Not surprisingly,',
		'As expected,',
		'Nothing is the same ever again once'
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
		'find a purpose'
	]);

	return `${part1} ${subject} ${part2}.`
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
		'They live',
		'They find themselves',
		'They work',
		'It begins',
		'Everything happens',
		'It opens',
		'It ends',
		'The climax takes place',
		'They end up',
		'They wind up',
		'Most of it occurs',
		'The beginning takes place',
		'The ending takes place'
	])

	// Fills in template to create story
	return `This ${genre} ${isAbout} ${char1}${char2}. ${takesPlace} ${settingPrep} ${setting} during ${period}. ${twist}`;
}

// Returns array of stories
async function generate(db, num = 1, filter) {
	let list = [];
	for (let i = 0; i < num; i++) {
		await template(db, filter).then(story => list.push(story));
	}
	// console.log(list);
	return list;
}

module.exports = { generate };