const express = require('express');

const StoryService = require('./story-service');
const UserService = require('../users/user-service');

const storyRouter = express.Router();
const jsonParser = express.json();

const serializeStory = story => ({
	id: story.id,
	title: story.title,
	content: story.content,
	author: story.author
});

storyRouter.route('/')
	.get((req, res, next) => {
		StoryService.getAllStories(
			req.app.get('db')
		)
			.then(stories => {
				res.json(stories.map(serializeStory))
			})
			.catch(next)
	})
	.post(jsonParser, (req, res, next) => {
		const newStory = {
			title: 'New Story',
			content: req.body.content,
			author: req.body.author
		}

		for (const [key, value] of Object.entries(newStory)) {
			if (value == null) {
				return res.status(400).json({
					error: { message: `Missing '${key}' in request body` }
				})
			}
		}

		StoryService.insertStory(
			req.app.get('db'),
			newStory
		)
			.then(story => {
				res
					.status(201)
					// .location(path.posix.join(req.originalUrl, `/${story.id}`))
					.json(serializeStory(story))
			})
			.catch(next)
	})

storyRouter
	.route('/list/:user_id')
	.all((req, res, next) => {
		UserService.getById(
			req.app.get('db'),
			req.params.user_id
		)
			.then(user => {
				if (!user) {
					return res.status(404).json({
						error: { message: `User doesn't exist` }
					})
				}
				next()
			})
			.catch(next)
	})
	.get((req, res, next) => {
		StoryService.getByAuthor(
			req.app.get('db'),
			req.params.user_id
		)
			.then(list => {
				if (list === []) {
					return res.status(404).json({
						error: { message: `Author has no stories` }
					})
				}
				res.json(list);
				next()
			})
			.catch(next)
	})


storyRouter
	.route('/:story_id')
	.all((req, res, next) => {
		StoryService.getById(
			req.app.get('db'),
			req.params.story_id
		)
			.then(story => {
				if (!story) {
					return res.status(404).json({
						error: { message: `Story doesn't exist` }
					})
				}
				res.story = story
				next()
			})
			.catch(next)
	})
	.get((req, res, next) => {
		res.json(serializeStory(res.user))
	})
	.delete((req, res, next) => {
		StoryService.deleteStory(
			req.app.get('db'),
			req.params.story_id
		)
			.then(() => {
				res.status(204).end()
			})
			.catch(next)
	})
	.patch(jsonParser, (req, res, next) => {
		const storyToUpdate = {
			title: req.body.title,
			content: req.body.content
		}

		const numberOfValues = Object.values(storyToUpdate).filter(Boolean).length
		if (numberOfValues === 0)
			return res.status(400).json({
				error: {
					message: `Request body must contain either 'title' or 'content'`
				}
			})

		StoryService.updateStory(
			req.app.get('db'),
			req.params.story_id,
			storyToUpdate
		)
			.then(() => {
				res.status(204).end()
			})
			.catch(next)
	})

module.exports = storyRouter;