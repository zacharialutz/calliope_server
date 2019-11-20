const express = require('express');

const { generate } = require('./generator');

const genRouter = express.Router();
const jsonParser = express.json();

// Runs generator with sent queries
genRouter.route('/')
	.get((req, res) => {
		const num = req.query.num;
		const arr = generate(num);
		res.json(arr)
		// .catch(next)
	})

module.exports = genRouter;