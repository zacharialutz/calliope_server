function makeStoryArray() {
	return [
		{
			id: 1,
			title: 'First Test Story',
			content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
			author: 1
		},
		{
			id: 2,
			title: 'Second Test Story',
			content: 'Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.',
			author: 1
		},
		{
			id: 3,
			title: 'Third Test Story',
			content: 'Adipisci, pariatur. Molestiae, libero esse hic adipisci autem neque?',
			author: 2
		}
	];
}

module.exports = { makeStoryArray };