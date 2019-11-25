require('dotenv').config;
const { expect } = require('chai');
const knex = require('knex');
const app = require('../src/app');

const { makeStoryArray } = require('./stories.fixtures');

describe('Story Endpoints', () => {
	let db;

	before('make knex instance', () => {
		db = knex({
			client: 'pg',
			connection: process.env.TEST_DATABASE_URL
		})
		app.set('db', db)
	})

	after('disconnect from db', () => db.destroy())

	before('clean the table', () => db('saved_stories').truncate())

	afterEach('cleanup', () => db('saved_stories').truncate())

	describe('GET /api/stories', () => {
		context('Given there are no stories', () => {
			it('responds with 200 and an empty list', () => {
				return supertest(app)
					.get('/api/stories')
					.expect(200, []);
			})
		});

		context('Given there are stories in the database', () => {
			const testStories = makeStoryArray();

			beforeEach('insert stories', () => {
				return db
					.into('saved_stories')
					.insert(testStories)
			})

			it('GET /api/stories responds with 200 and all the stories', () => {
				return supertest(app)
					.get('/api/stories')
					.expect(200, testStories)
			})
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