require('dotenv').config;
const { expect } = require('chai');
const knex = require('knex');
const app = require('../src/app');

const { makeStoryArray, expectedStoryArray } = require('./stories.fixtures');
const { makeUserArray } = require('./users.fixtures');

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

	before('clean the table', () => db.raw('TRUNCATE saved_stories, users RESTART IDENTITY CASCADE'))

	afterEach('cleanup', () => db.raw('TRUNCATE saved_stories, users RESTART IDENTITY CASCADE'))

	describe('GET /api/stories', () => {
		context('Given there are no stories', () => {
			it('responds with 200 and an empty list', () => {
				return supertest(app)
					.get('/api/stories')
					.expect(200, []);
			})
		});

		context('Given there are stories in the database', () => {
			const testUsers = makeUserArray();
			const testStories = makeStoryArray();

			beforeEach('insert users', () => {
				return db
					.into('users')
					.insert(testUsers)
			})
			beforeEach('insert stories', () => {
				return db
					.into('saved_stories')
					.insert(testStories)
			})

			it('GET /api/stories responds with 200 and all the stories', () => {
				return supertest(app)
					.get('/api/stories')
					.expect(200)
					.then(res => expect(res.body).to.be.lengthOf(testStories.length));
			})

			it('GET /api/stories/:story_id responds with 200 and a specific story', () => {
				const storyId = 1;
				const expectedStory = testStories[storyId - 1];
				return supertest(app)
					.get(`/api/stories/${storyId}`)
					.expect(200)
					.expect(res => {
						expect(res.body.id).to.eql(storyId);
						expect(res.body.title).to.eql(expectedStory.title);
						expect(res.body.content).to.eql(expectedStory.content);
					})
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