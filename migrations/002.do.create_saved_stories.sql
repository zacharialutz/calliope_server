CREATE TABLE saved_stories (
	id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
	title TEXT NOT NULL,
	content TEXT,
	author INTEGER NOT NULL
);