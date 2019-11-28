DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  username TEXT NOT NULL UNIQUE,
  password TEXT,
  email TEXT,
  date_created TIMESTAMP NOT NULL DEFAULT now()
);

INSERT INTO users (username, password, email)
  VALUES ('demo', 'password', 'zacharia.lutz@gmail.com');

DROP TABLE IF EXISTS saved_stories;
CREATE TABLE saved_stories (
	id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
	title TEXT NOT NULL,
	content TEXT,
	author INTEGER NOT NULL REFERENCES users(id)
);