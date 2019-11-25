require('dotenv').config;
const { expect } = require('chai');
const knex = require('knex');
const app = require('../src/app');

const { makeUserArray } = require('./users.fixtures');

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

	before('clean the table', () => db('users').truncate())

	afterEach('cleanup', () => db('users').truncate())

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

			beforeEach('insert users', () => {
				return db
					.into('users')
					.insert(testUsers)
			})

			it('GET /api/users responds with 200 and all the users', () => {
				return supertest(app)
					.get('/api/users')
					.expect(200, testUsers)
			})

			// it('GET /api/stories/:user_id ')
		})
	});

	// describe('POST /api/stories', () => {
	// 	it('creates a story, responding with 201 and the new story', function() {
	// 		const newStory = {
	// 			title: 'Test new story',
	// 			content: 'Test new content...'
	// 		}
	// 		return supertest(app)
	// 			.post('/api/stories')
	// 			.send(newStory)
	// 			.expect(201)
	// 			.expect(res => {
	// 				expect(res.body.title).to.eql(newStory.title)
	// 				expect(res.body.content).to.eql(newStory.content)
	// 				expect(res.body).to.have.property('id')
	// 				expect(res.headers.location).to.eql(`/api/stories/${res.body.id}`)
	// 			})
	// 			.then(postRes =>
	// 				supertest(app)
	// 					.get(`/api/stories/${postRes.body.id}`)
	// 					.expect(postRes.body)
	// 			)
	// 	})

	// 	const requiredFields = ['title'];

	// 	requiredFields.forEach(field => {
	// 		const newStory = {
	// 			title: 'Test new story',
	// 			content: 'Test new content...'
	// 		}
	// 		it(`responds with 400 and an error message when the ${field} is missing`, () => {
	// 			delete newStory[field]

	// 			return supertest(app)
	// 				.post('/api/stories')
	// 				.send(newStory)
	// 				.expect(400, {
	// 					error: { message: `Missing ${field} in request body` }
	// 				})
	// 		})
	// 	})
	// })
})