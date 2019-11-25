const express = require('express');

const { generate } = require('./generator');

const genRouter = express.Router();
const jsonParser = express.json();

// Runs generator with sent queries
genRouter.route('/')
	.get((req, res, next) => {
		const filter = [];
		if (req.query.modern === 'false') filter.push('modern');
			else filter.push('off');
		if (req.query.historic === 'false') filter.push('historic');
			else filter.push('off');
		if (req.query.scifi === 'false') filter.push('scifi');
			else filter.push('off');
		if (req.query.fantasy === 'false') filter.push('fantasy');
			else filter.push('off');
		generate(
			req.app.get('db'),
			req.query.num,
			filter
		)
		.then(stories => {
			console.log(stories);
			res.json(stories);
		})
		.catch(next)
	})

module.exports = genRouter;