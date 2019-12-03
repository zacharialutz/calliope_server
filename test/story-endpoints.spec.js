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

		it('GET /api/stories/story_id responds with 404 and an error', () => {
			return supertest(app)
				.get('/api/stories/1234')
				.expect(404, { error: { message: `Story doesn't exist` } })
		})

		context('Given there are stories in the database', () => {
			const testUsers = makeUserArray();
			const testStories = makeStoryArray();

			beforeEach('insert stories', () => {
				return db
					.into('users')
					.insert(testUsers)
					.then(() => {
				  		return db
							.into('saved_stories')
							.insert(testStories)
				})
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

	describe('GET /api/stories/list/:user_id', () => {
		context('Given there are no stories', () => {
			it('responds with 404 and an error', () => {
				return supertest(app)
					.get('/api/stories/list/1234')
					.expect(404, { error: { message: `User doesn't exist` } });
			})
		});

		context('Given there are stories in the database', () => {
			const testUsers = makeUserArray();
			const testStories = makeStoryArray();

			beforeEach('insert stories', () => {
				return db
					.into('users')
					.insert(testUsers)
					.then(() => {
				  		return db
							.into('saved_stories')
							.insert(testStories)
				})
			})

			it(`GET /api/list/:user_id responds with 200 and all that user's stories`, () => {
				const testId = 1;
				return supertest(app)
					.get(`/api/stories/list/${testId}`)
					.expect(200)
					.then(res => expect(res.body).to.be.lengthOf(2));
			})
		})
	});

	describe('POST /api/stories', () => {
		const testUsers = makeUserArray();

		beforeEach('insert users', () => {
			return db
				.into('users')
				.insert(testUsers)
		})

		it('creates a story, responding with 201 and the new story', () => {
			const newStory = {
				title: 'Test new story',
				content: 'Test new content...',
				author: 2
			}
			return supertest(app)
				.post('/api/stories')
				.send(newStory)
				.expect(201)
				.expect(res => {
					expect(res.body.title).to.eql(newStory.title)
					expect(res.body.content).to.eql(newStory.content)
					expect(res.body).to.have.property('id')
				})
				.then(postRes =>
					supertest(app)
						.get(`/api/stories/${postRes.body.id}`)
						.expect(postRes.body)
				)
		})

		const requiredFields = ['title', 'content', 'author'];

		requiredFields.forEach(field => {
			const newStory = {
				title: 'Test new story',
				content: 'Test new content...',
				author: 2
			}
			it(`responds with 400 and an error message when the ${field} is missing`, () => {
				delete newStory[field]

				return supertest(app)
					.post('/api/stories')
					.send(newStory)
					.expect(400, { error: { message: `Missing '${field}' in request body` } })
			})
		})
	})

	describe(`PATCH /api/stories/:story_id`, () => {
		context('Given no stories', () => {
			it('responds with 404', () => {
				const storyId = 123456;
				return supertest(app)
					.patch(`/api/stories/${storyId}`)
					.expect(404, { error: { message: `Story doesn't exist` } })
			})
		})

		context('Given there are stories in the database', () => {
			const testUsers = makeUserArray();
			const testStories = makeStoryArray();

			beforeEach('insert stories', () => {
				return db
					.into('users')
					.insert(testUsers)
					.then(() => {
				  		return db
							.into('saved_stories')
							.insert(testStories)
				})
			})

			it('responds with 204 and updates the story', () => {
				const testId = 2;
				const updateStory = {
					title: 'Updated title',
					content: 'Updated content',
				};
				const expectedStory = {
					id: testId,
					title: updateStory.title,
					content: updateStory.content,
					author: testStories[testId - 1].author
				}
				return supertest(app)
					.patch(`/api/stories/${testId}`)
					.send(updateStory)
					.expect(204)
					.then(res =>
						supertest(app)
							.get(`/api/stories/${testId}`)
							.expect(expectedStory)
					)
			})

			it('responds with 400 when no required fields supplied', () => {
				const testId = 2;
				return supertest(app)
					.patch(`/api/stories/${testId}`)
					.send({ irrelevant: 'bogus' })
					.expect(400,
						{ error: { message: `Request body must contain either 'title' or 'content'` } }
					)
			})

			it('responds with 204 when updating only a subset of fields', () => {
				const testId = 2;
				const updateStory = {
					title: 'Updated title'
				}
				const expectedStory = {
					id: testId,
					title: updateStory.title,
					content: testStories[testId - 1].content,
					author: testStories[testId - 1].author
				}

				return supertest(app)
					.patch(`/api/stories/${testId}`)
					.send({
						...updateStory,
						fieldToIgnore: 'should not be in GET response'
					})
					.expect(204)
					.then(res =>
						supertest(app)
							.get(`/api/stories/${testId}`)
							.expect(expectedStory)
					)
			})
		})
	})
})