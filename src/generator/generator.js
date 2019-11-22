const WordService = require('./word-service')

// Returns a random integer from 1 to (num)
function roll(num) {
	return Math.floor( (Math.random() * num) ) + 1;
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
	return character;
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

// Generates items to insert into modular template --------------!
async function template(db) {
	const genre = await makeGenre(db);
	const char1 = await makeCharacter(db);
	const { setting, settingPrep } = await makeSetting(db);
	const period = await makePeriod(db);

	// Fills in template slots to create final story
	let story = `This ${genre} is about ${a(char1)}. It takes place ${settingPrep} ${setting} during ${period}.`;
	// console.log(story);
	return story;
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