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

		context('Given there are users in the database', () => {
			const testUsers = makeUserArray();
			const expectedUsers = expectedUserArray();

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
				const user = 0;
				return supertest(app)
					.get('/api/users')
					.expect(200)
					.expect(res => {
						expect(res.body).to.have.lengthOf(2);
						expect(res.body[user].id).to.eql(user + 1);
						expect(res.body[user].username).to.eql(expectedUsers[user].username);
						expect(res.body[user].email).to.eql(expectedUsers[user].email);
						expect(res.body[user].password).to.eql(expectedUsers[user].password);
					})
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
	});

	describe('DELETE /api/users/user:id', () => {
		context('Given no user', () => {
			it('responds with 404', () => {
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