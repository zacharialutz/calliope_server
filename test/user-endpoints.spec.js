require('dotenv').config;
const { expect } = require('chai');
const knex = require('knex');
const app = require('../src/app');

const { makeUserArray, expectedUserArray } = require('./users.fixtures');

describe('User Endpoints', () => {
	let db;

	before('make knex instance', () => {
		db = knex({
			client: 'pg',
			connection: process.env.TEST_DATABASE_URL
		})
		app.set('db', db)
	})

	after('disconnect from db', () => db.destroy())

	before('clean the table', () => db.raw('TRUNCATE saved_stories, users RESTART IDENTITY CASCADE'))

	afterEach('cleanup', () => db.raw('TRUNCATE saved_stories, users RESTART IDENTITY CASCADE'))

	describe('GET /api/users', () => {
		context('Given there are no users', () => {
			it('responds with 200 and an empty list', () => {
				return supertest(app)
					.get('/api/users')
					.expect(200, []);
			})
		});

		it('GET /api/users/:user_id responds with 404 and an error', () => {
			const userId = 1;
			return supertest(app)
				.get(`/api/users/${userId}`)
				.expect(404, { error: { message: `User doesn't exist` } })
		})

		context('Given there are users in the database', () => {
			const testUsers = makeUserArray();

			beforeEach('insert users', () => {
				return db
					.into('users')
					.insert(testUsers)
			})

			it('GET /api/users responds with 200 and all the users', () => {
				return supertest(app)
					.get('/api/users')
					.expect(200)
					.then(res => expect(res.body).to.have.lengthOf(testUsers.length))
			})

			it('GET /api/users/:user_id responds with 200 and a specific user', () => {
				const userId = 1;
				const expectedUser = testUsers[userId - 1];
				return supertest(app)
					.get(`/api/users/${userId}`)
					.expect(200)
					.expect(res => {
						expect(res.body.username).to.eql(expectedUser.username)
						expect(res.body.email).to.eql(expectedUser.email)
						expect(res.body.password).to.eql(expectedUser.password)
						expect(res.body).to.have.property('id')
					})
			})
		})
	});

	describe('GET /api/login', () => {
		context('Given there are no users', () => {
			it('responds with 404 and an error', () => {
				return supertest(app)
					.get('/api/users/login?username=12345')
					.expect(404, { error: { message: `Incorrect name and/or password` } });
			})
		});

		context('Given there are users in the database', () => {
			const testUsers = makeUserArray();

			beforeEach('insert users', () => {
				return db
					.into('users')
					.insert(testUsers)
			})

			it('GET /api/users/login responds with 200 and a specific user', () => {
				const testId = 0;
				const testName = testUsers[testId].username;
				const testPassword = testUsers[testId].password;
				const expectedUser = testUsers[testId];
				return supertest(app)
					.get(`/api/users/login?username=${testName}&password=${testPassword}`)
					.expect(200)
					.expect(res => {
						expect(res.body.username).to.eql(expectedUser.username)
						expect(res.body.email).to.eql(expectedUser.email)
						expect(res.body.password).to.eql(expectedUser.password)
						expect(res.body).to.have.property('id')
					})
			})

			it('GET /api/users/login and bad password responds with 400 and an error', () => {
				const testId = 0;
				const testName = testUsers[testId].username;
				const testPassword = 'bogus';
				const expectedUser = testUsers[testId];
				return supertest(app)
					.get(`/api/users/login?username=${testName}&password=${testPassword}`)
					.expect(400, { error: { message: `Incorrect name and/or password` } });
			})
		})
	});

	describe('POST /api/users', () => {
		it('POST responds with 201 and the new user', () => {
			const newUser = {
				username: 'Liz',
				email: 'stilebydesign@gmail.com',
				password: '555',
			}
			return supertest(app)
				.post('/api/users')
				.send(newUser)
				.expect(201)
				.expect(res => {
					expect(res.body.username).to.eql(newUser.username)
					expect(res.body.email).to.eql(newUser.email)
					expect(res.body.password).to.eql(newUser.password)
					expect(res.body).to.have.property('id')
					expect(res.headers.location).to.eql(`/api/users/${res.body.id}`)
				})
				.then(postRes =>
					supertest(app)
						.get(`/api/users/${postRes.body.id}`)
						.expect(postRes.body)
				)
		})

		const requiredFields = ['username', 'email', 'password'];

		requiredFields.forEach(field => {
			const newUser = {
				username: 'NewUser',
				email: 'test@example.com',
				password: 333
			}
			it(`responds with 400 and an error message when the ${field} is missing`, () => {
				delete newUser[field]

				return supertest(app)
					.post('/api/users')
					.send(newUser)
					.expect(400, { error: { message: `Missing '${field}' in request body` } })
			})
		})
	});

	describe('DELETE /api/users/user:id', () => {
		context('Given no user', () => {
			it('responds with 404 and an error', () => {
				const userId = 123456;
				return supertest(app)
					.delete(`/api/users/${userId}`)
					.expect(404, { error: { message: `User doesn't exist` } })
			})
		})

		context('Given there are users in the database', () => {
			const testUsers = makeUserArray();
			const expectedUsers = expectedUserArray();

			beforeEach('insert users', () => {
				return db
					.into('users')
					.insert(testUsers)
			})

			it('responds with 204 and removes the user', () => {
				const idToRemove = 2
				const expected = expectedUsers.filter(user => user.id !== idToRemove)
				return supertest(app)
					.delete(`/api/users/${idToRemove}`)
					.expect(204)
					.then(() =>
						supertest(app)
							.get(`/api/users`)
							.expect(res => {
								expect(res.body.username).to.eql(expected.username)
								expect(res.body.email).to.eql(expected.email)
								expect(res.body.password).to.eql(expected.password)
							})
					)
			})
		})
	})
})