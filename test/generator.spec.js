require('dotenv').config;
const { expect } = require('chai');
const knex = require('knex');
const app = require('../src/app');

const WordService = require('../src/generator/word-service')

const testFilter = ['off', 'off', 'off', 'off'];

describe('Generator Endpoint', () => {
	before('make knex instance', () => {
		db = knex({
			client: 'pg',
			connection: process.env.DATABASE_URL
		})
		app.set('db', db)
	})

	after('disconnect from db', () => db.destroy())

	it('responds with 200 and an array of given number', async () => {
		const testNum = 7;
		return supertest(app)
			.get(`/api/generator?num=${testNum}`)
			.expect(200)
			.then(res => expect(res.body).to.be.an('array').with.lengthOf(7));
	})
})

describe('WordService', () => {
	before('make knex instance', () => {
		db = knex({
			client: 'pg',
			connection: process.env.DATABASE_URL
		})
		app.set('db', db)
	})

	after('disconnect from db', () => db.destroy())

	it('getNoun returns a single string', async () => {
		expect(await WordService.getNoun(db, 'singular', 'genre', testFilter)).to.be.a('string');
	})

	it('getAdjective returns a single string', async () => {
		expect(await WordService.getAdjective(db, 'animate', testFilter)).to.be.a('string');
	})

	it('getVerb returns a single string', async () => {
		expect(await WordService.getVerb(db, 'infinitive', testFilter)).to.be.a('string');
	})

	it('getModifier returns a single string', async () => {
		expect(await WordService.getModifier(db, 'modifier', testFilter)).to.be.a('string');
	})

	it('getSetting returns an array of size two, the first of which is a string', async () => {
		await WordService.getSetting(db, 'setting', testFilter)
			.then(res => {
				expect(res).to.be.an('array').with.lengthOf(2);
				expect(res[0]).to.be.a('string');
			})
	})
})