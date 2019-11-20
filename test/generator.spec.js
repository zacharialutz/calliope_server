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
})