require('dotenv').config;
const { expect } = require('chai');
const knex = require('knex');
const app = require('../src/app');

describe('Generator Endpoint', () => {
	it('responds with 200 and an array', () => {
		return supertest(app)
			.get('/api/generator')
			.expect(200)
			.then(res => 
				expect(res.body).to.be.an('array')
			);
	})

	it('response array is length of given number', () => {
		const testNum = 7;
		return supertest(app)
			.get(`/api/generator?num=${testNum}`)
			.expect(200)
			.then(res =>
				expect(res.body.length).to.eql(7)
			);
	})
})