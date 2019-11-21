// Picks a random item from an array
function randomOne(arr) {
	const roll = Math.floor( (Math.random() * arr.length) );
	return arr[roll].singular;
}

const WordService = {
	getNoun(knex, cat) {
		return knex
			.select('*')
			.from('nouns')
			.where('category', cat)
			.then(arr => randomOne(arr));
	},
};

module.exports = WordService;