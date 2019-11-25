// Filters out unchecked themed words
function themeFilter(arr, filter) {
	return arr.filter(item => !filter.includes(item.theme));
}

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

// Picks a random setting from an array
function randomSetting(arr) {
	const roll = Math.floor( (Math.random() * arr.length) );
	let pick = [
		arr[roll].singular,
		arr[roll].prep
	];
	return pick;
}

const WordService = {
	// Queries DB for type of nouns and returns a random one
	// knex: db connection
	// label: singular or plural
	// cat: category
	getNoun(knex, label, cat, filter) {
		return knex
			.select('*')
			.from('nouns')
			.where('category', cat)
			.then(arr => themeFilter(arr, filter))
			.then(arr => randomOne(arr, label));
	},
	
	// Queries DB for setting or location noun and returns a random one with its prep
	// knex: db connection
	getSetting(knex, cat, filter) {
		return knex
			.select('*')
			.from('nouns')
			.where('category', cat)
			.then(arr => themeFilter(arr, filter))
			.then(arr => randomSetting(arr));
	},

	// Queries DB for type of adjectives and returns a random one
	// knex: db connection
	// cat: category
	getAdjective(knex, cat, filter) {
		return knex
			.select('*')
			.from('adjectives')
			.where('category', cat)
			.then(arr => themeFilter(arr, filter))
			.then(arr => randomOne(arr, 'adj'));
	},

	// Queries DB for adjective modifier
	// knex: db connection
	getModifier(knex, filter) {
		return knex
			.select('*')
			.from('adjectives')
			.where('category', 'modifier')
			.then(arr => themeFilter(arr, filter))
			.then(arr => randomOne(arr, 'adj'));
	}
};

module.exports = WordService;