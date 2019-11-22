// Picks a random item from an array
function randomOne(arr, multi) {
	const roll = Math.floor( (Math.random() * arr.length) );
	if (multi) return arr[roll].plural;
	else return arr[roll].singular;
}

const WordService = {
	// Queries DB for type of nouns and returns a random one
	// knex: db connection
	// multi: true if plural
	// cat: category
	getNoun(knex, multi, cat) {
		return knex
			.select('*')
			.from('nouns')
			.where('category', cat)
			.then(arr => randomOne(arr, multi));
	},
};

module.exports = WordService;