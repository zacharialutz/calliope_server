-- psql -U zacharialutz -d wordbank -f ./seeds/seed.adjectives.sql

INSERT INTO saved_stories (title, content, author)
VALUES
	('Sample Story 1',
		'This story is being provided by the server!', 1),
	('Sample Story 2',
		'Once upon a time there was a web server that provided test stories.', 1),
	('Sample Story 3',
		'It was the best of servers. It was the worst of servers.', 2);