require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

const { NODE_ENV } = require('./config');
const { CLIENT_ORIGIN } = require('./config');

const storyRouter = require('./api/story-router');
const app = express();

const morganOption = (NODE_ENV === 'production')
	? 'tiny'
	: 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(
    cors({
        origin: CLIENT_ORIGIN
    })
);

app.use('/api/stories', storyRouter);

app.get('/', (req, res) => {
	res.send('Hello beautiful!');
})

app.use(function errorHandler(error, req, res, next) {
	let response;
	if (NODE_ENV === 'production') {
		response = { error: { message: 'server error' } };
	} else {
		response = { error };
	};
	res.status(500).json(response);
})

module.exports = app;