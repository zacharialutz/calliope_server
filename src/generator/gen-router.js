const express = require('express');

const { generate } = require('./generator');

const genRouter = express.Router();
const jsonParser = express.json();

genRouter.route('/')
	.get((req, res) => {
		const arr = generate();
		// const arr = [];
		res.json(arr)
		// .catch(next)
	})

module.exports = genRouter;