const WordService = require('./word-service')

const demoStories = [
	'The quick brown fox jumped over the lazy dog.',
	'This is the best of stories. This is the worst of stories.',
	'For sale: baby shoes, never worn.',
	'Once upon a time there was a test story.',
	'My very eager mother just served us nine pizzas.',
	'Rubber baby buggy bumpers',
	'Winner winner, chicken dinner!',
	'This is a test. A test it is. Test test test.',
	'The question is: how far down the rabbit hole do you want to go?',
	'The more things change, the more they stay the same.'
]

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

async function template(db) {
	// Generate genre
	let genre;
	await WordService.getNoun(
		db, 'singular', 'genre'
	)
		.then(val => genre = val);
	
	// Generate protagonist
	let person1;
		if (roll(3) === 1) {
			await WordService.getAdjective(
				db, 'general'
			)
				.then(val => person1 = val);
		}
		else {
			await WordService.getAdjective(
				db, 'animate'
			)
				.then(val => person1 = val);
		}
		await WordService.getNoun(
			db, 'singular', 'animate'
		)
			.then(val => person1 += ` ${val}`);

	let location;
	let locationPrep = 'in';
		if (roll(3) === 1) {
			await WordService.getSetting(
				db, 'location'
			)
				.then(val => {
					location = val[0];
					if (val[1]) locationPrep = val[1];
				});
		}
		else {
			await WordService.getAdjective(
				db, 'place'
			)
				.then(val => location = val);
			await WordService.getSetting(
				db, 'setting'
			)
				.then(val => {
					location += ` ${val[0]}`;
					location = a(location);
					if (val[1]) locationPrep = val[1];
				});
		}

	let period;
		await WordService.getNoun(
			db, 'singular', 'period'
		)
		.then(val => period = val);
	// ----------------------------------------------------
	let story = `This ${genre} is about ${a(person1)}. It takes place ${locationPrep} ${location} during ${period}.`;
	// console.log(story);
	return story;
}

// Returns a random item from demo array
function randomDemo() {
	const pick = roll(demoStories.length);
	return demoStories[pick - 1];
}

// Returns array of stories
async function generate(db, num = 1) {
	let list = [];
	for (let i = 0; i < num; i++) {
		await template(db).then(story => list.push(story));
	}
	console.log(list);
	return list;
}

module.exports = { generate };