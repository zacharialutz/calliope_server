const WordService = require('./word-service')

// Returns a random integer from 1 to (num)
function roll(num) {
	return Math.floor( (Math.random() * num) ) + 1;
}

// Picks a random item from an array
function getOne(arr) {
	const roll = Math.floor( (Math.random() * arr.length) );
	return arr[roll];
}

// Turns 'a' into 'an' if input starts with a vowel
function a (str) {
	const vowels = ['a','e','i','o','u'];
	if (vowels.includes(str.charAt(0))) return `an ${str}`;
	else return `a ${str}`;
}

// Generates a genre
async function makeGenre(db) {
	let genre;
	await WordService.getNoun(
		db, 'singular', 'genre'
	)
		.then(val => genre = val);
	return genre;
}

// Generates an adjective
async function makeAdj(db, cat) {
	let adj = '';
	if (roll(3) === 1) await WordService.getModifier(
		db, cat
	)
		.then(val => adj = `${val} `);

	await WordService.getAdjective(
		db, cat
	)
		.then(val => adj += val);
	return adj;
}

// Generates a character with an adjective
async function makeCharacter(db) {
	let character;
	if (roll(3) === 1) character = await makeAdj(db, 'general');
	else character = await makeAdj(db, 'animate');

	await WordService.getNoun(
		db, 'singular', 'animate'
	)
		.then(val => character += ` ${val}`);
	character = a(character);
	return character;
}

// Generates an object with an adjective
async function makeObject(db) {
	let object;
	if (roll(3) === 1) object = await makeAdj(db, 'general');
	else object = await makeAdj(db, 'object');

	await WordService.getNoun(
		db, 'singular', 'object'
	)
		.then(val => object += ` ${val}`);
	object = a(object);
	return object;
}

// Generates either a named location or a setting with adjective
async function makeSetting(db) {
	let setting;
	let settingPrep = 'in';
		if (roll(3) === 1) {
			await WordService.getSetting(
				db, 'location'
			)
				.then(val => {
					setting = val[0];
					if (val[1]) settingPrep = val[1];
				});
		}
		else {
			if (roll(3) === 1) setting = await makeAdj(db, 'general');
			else setting = await makeAdj(db, 'place');

			await WordService.getSetting(
				db, 'setting'
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
async function makePeriod(db) {
	let period;
	await WordService.getNoun(
		db, 'singular', 'period'
	)
	.then(val => period = val);
	return period;
}

// Generates a plot twist
async function makeTwist(db) {
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
		'Trouble begins when',
		'Everything calms down when'
	]);

	let subject;
	if (roll(2) === 1) subject = await makeCharacter(db);
	else subject = await makeObject(db);

	const part2 = getOne([
		'is found',
		'is rediscovered',
		'disappears',
		'appears',
		'gets lost',
		'shows up',
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
		'is no longer important'
	]);

	return `${part1} ${subject} ${part2}.`
}

// Generates items to insert into modular template
async function template(db) {
	const genre = await makeGenre(db);
	const char1 = await makeCharacter(db);
	const { setting, settingPrep } = await makeSetting(db);
	const period = await makePeriod(db);
	const twist = await makeTwist(db);

	// Fills in template slots to create final story
	return `This ${genre} is about ${char1}. It takes place ${settingPrep} ${setting} during ${period}. ${twist}`;
}

// Returns array of stories
async function generate(db, num = 1) {
	let list = [];
	for (let i = 0; i < num; i++) {
		await template(db).then(story => list.push(story));
	}
	// console.log(list);
	return list;
}

module.exports = { generate };