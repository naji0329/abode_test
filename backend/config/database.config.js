let dotenv = require('dotenv').config()

module.exports = {
  url: dotenv.parsed.mongoUri
};