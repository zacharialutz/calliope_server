require('dotenv').config;
const { expect } = require('chai');
const knex = require('knex');
const app = require('../src/app');

const WordService = require('../src/generator/word-service')

const testFilter = ['off', 'off', 'off', 'off'];

describe('Generator Endpoint', () => {
	it('responds with 200 and an array of given number', () => {
		const testNum = 7;
		return supertest(app)
			.get(`/api/generator?num=${testNum}`)
			.expect(200)
			.then(res => {
				expect(res.body).to.be.an('array');
				expect(res.body.length).to.eql(7);
			});
	})
})

describe('WordService', () => {
	before('make knex instance', () => {
		db = knex({
			client: 'pg',
			connection: process.env.DB_URL
		})
		app.set('db', db)
	})

	after('disconnect from db', () => db.destroy())

	it('getNoun returns a single string', async () => {
		expect(await WordService.getNoun(db, 'singular', 'animate', testFilter)).to.be.a('string');
		// console.log(await WordService.getNoun(db, true, 'animate'));
	})
})