require('dotenv').config();

const PORT = process.env.PORT || 3000;

const AI_DEPTH = process.env.AI_DEPTH || 3;

module.exports = { PORT, AI_DEPTH };

