const express = require('express');

const { generate } = require('./generator');

const genRouter = express.Router();
const jsonParser = express.json();

// Runs generator with sent queries
genRouter.route('/')
	.get((req, res, next) => {
		generate(
			req.app.get('db'),
			req.query.num
		)
		.then(stories => {
			// console.log(stories);
			res.json(stories);
		})
		.catch(next)
	})

module.exports = genRouter;