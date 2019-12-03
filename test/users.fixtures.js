function makeUserArray() {
	return [
		{
			username: 'zjlutz',
			email: 'zacharia.lutz@gmail.com',
			password: '1234'
		},
		{
			username: 'Tim',
			email: 'cat@cat.com',
			password: 'meow'
		}
	];
}

function expectedUserArray() {
	return [
		{
			id: 1,
			username: 'zjlutz',
			email: 'zacharia.lutz@gmail.com',
			password: '1234'
		},
		{
			id: 2,
			username: 'Tim',
			email: 'cat@cat.com',
			password: 'meow'
		}
	];
}

module.exports = { makeUserArray, expectedUserArray };