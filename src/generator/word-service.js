// Picks a random item from an array
function randomOne(arr, label) {
	const roll = Math.floor( (Math.random() * arr.length) );
	let pick;
	switch (label) {
		case 'singular':
			pick = arr[roll].singular;
			break;
		case 'plural':
			pick = arr[roll].plural;
			break;
		case 'adj':
			pick = arr[roll].adj;
	}
	// console.log(pick);
	return pick;
}

const WordService = {
	// Queries DB for type of nouns and returns a random one
	// knex: db connection
	// label: singular or plural
	// cat: category
	getNoun(knex, label, cat) {
		return knex
			.select('*')
			.from('nouns')
			.where('category', cat)
			.then(arr => randomOne(arr, label));
	},
	// Queries DB for type of adjectives and returns a random one
	// knex: db connection
	// cat: category
	getAdjective(knex, cat) {
		return knex
			.select('*')
			.from('adjectives')
			.where('category', cat)
			.then(arr => randomOne(arr, 'adj'));
	}
};

module.exports = WordService;