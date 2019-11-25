const express = require('express');

const { generate } = require('./generator');

const genRouter = express.Router();
const jsonParser = express.json();

function parseQuery(q) {
	const filter = ['off', 'off', 'off', 'off'];
	if (q.modern === 'false') filter[0] = 'modern';
	if (q.historic === 'false') filter[1] = 'historic';
	if (q.scifi === 'false') filter[2] = 'scifi';
	if (q.fantasy === 'false') filter[3] = 'fantasy';
	return filter;
}

// Runs generator with sent queries
genRouter.route('/')
	.get((req, res, next) => {
		const filter = parseQuery(req.query);
		generate(
			req.app.get('db'),
			req.query.num,
			filter
		)
		.then(stories => {
			res.json(stories);
		})
		.catch(next)
	})

module.exports = genRouter;