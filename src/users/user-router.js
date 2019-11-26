const path = require('path')
const express = require('express')
const xss = require('xss')
const UserService = require('./user-service')

const userRouter = express.Router()
const jsonParser = express.json()

const serializeUser = user => ({
	id: user.id,
	username: xss(user.username),
	email: xss(user.email),
	password: xss(user.password),
	date_created: user.date_created,
})

userRouter
	.route('/')
	.get((req, res, next) => {
		UserService.getAllUsers(req.app.get('db'))
			.then(users => {
				res.json(users.map(serializeUser))
			})
			.catch(next)
	})
	.post(jsonParser, (req, res, next) => {
		const newUser = {
			username: req.body.username,
			email: req.body.email,
			password: req.body.password
		}

		for (const [key, value] of Object.entries(newUser)) {
			if (value == null) {
				return res.status(400).json({
					error: { message: `Missing '${key}' in request body` }
				})
			}
		}
		console.log(newUser);

		UserService.insertUser(
			req.app.get('db'),
			newUser
		)
			.then(user => {
				res
					.status(201)
					.location(path.posix.join(req.originalUrl, `/${user.id}`))
					.json(serializeUser(user))
			})
			.catch(next)
	})

userRouter
	.route('/login')
	.all((req, res, next) => {
		UserService.getByUsername(
			req.app.get('db'),
			req.query.username
		)
			.then(user => {
				if (!user) {
					return res.status(404).json({
						error: { message: `Incorrect name and/or password` }
					})
				}
				res.user = user
				next()
			})
			.catch(next)
	})
	.get((req, res, next) => {
		// console.log(req.query);
		UserService.getByUsername(
			req.app.get('db'),
			req.query.username
		)
			.then(user => {
				if (user.password !== req.query.password) {
					return res.status(400).json({
						error: { message: `Incorrect name and/or password` }
					})
				}
				else res.json(serializeUser(user))
			})
			.catch(next)
	})

userRouter
	.route('/:user_id')
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
				res.user = user
				next()
			})
			.catch(next)
	})
	.get((req, res, next) => {
		res.json(serializeUser(res.user))
	})
	.delete((req, res, next) => {
		UserService.deleteUser(
			req.app.get('db'),
			req.params.user_id
		)
			.then(() => {
				res.status(204).end()
			})
			.catch(next)
	})
// .patch(jsonParser, (req, res, next) => {
// 	const { username, password, email } = req.body
// 	const userToUpdate = { username, password, email }

// 	const numberOfValues = Object.values(userToUpdate).filter(Boolean).length
// 	if (numberOfValues === 0)
// 		return res.status(400).json({
// 			error: {
// 				message: `Request body must contain either 'username', 'password' or 'email'`
// 			}
// 		})

// 	UserService.updateUser(
// 		req.app.get('db'),
// 		req.params.user_id,
// 		userToUpdate
// 	)
// 		.then(() => {
// 			res.status(204).end()
// 		})
// 		.catch(next)
// })

module.exports = userRouter