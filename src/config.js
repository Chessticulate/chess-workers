require('dotenv').config();

const SERVER_PORT = process.env.PORT || 3000;

const AI_DEPTH = process.env.AI_DEPTH || 3;

const N_WORKERS = process.env.N_WORKERS;

module.exports = { SERVER_PORT, AI_DEPTH, N_WORKERS };

