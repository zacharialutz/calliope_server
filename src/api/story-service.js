const StoryService = {
	getAllStories(knex) {
		return knex
			.select('*')
			.from('saved_stories');
	},
	insertStory(knex, newStory) {
		return knex
			.insert(newStory)
			.into('saved_stories')
			.returning('*')
			.then(rows => rows[0]);
	},
	getById(knex, id) {
		return knex
			.from('saved_stories')
			.select('*')
			.where('id', id)
			.first();
	},
	deleteStory(knex, id) {
		return knex('saved_stories')
			.where({ id })
			.delete();
	},
	updateStory(knex, id, newStoryFields) {
		return knex('saved_stories')
			.where({ id })
			.update(newStoryFields);
	}
};

module.exports = StoryService;