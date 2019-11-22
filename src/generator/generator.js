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
	let person1;
	await WordService.getNoun(
		db, false, 'animate'
	)
	.then(val => person1 = val);
	
	let story = `This story is about ${a(person1)}.`;
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