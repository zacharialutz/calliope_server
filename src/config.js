module.exports = {
	PORT: process.env.PORT || 8000,
	CLIENT_ORIGIN: 3000,
	NODE_ENV: process.env.NODE_ENV || 'development',
	DB_URL: process.env.DB_URL || 'postgresql://zacharialutz@localhost/wordbank',
	API_BASE_URL: process.env.REACT_APP_API_BASE_URL || "http://localhost:3000/api"
}