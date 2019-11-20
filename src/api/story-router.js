const express = require('express');

const StoryService = require('./story-service');

const storyRouter = express.Router();
const jsonParser = express.json();

const zippedStory = story => ({
	id: story.id,
	title: story.title,
	content: story.content
});

storyRouter.route('/')
	.get((req, res, next) => {
		StoryService.getAllStories(
			req.app.get('db')
		)
		.then(stories => {
			res.json(stories.map(zippedStory))
		})
		.catch(next)
	})

module.exports = storyRouter;