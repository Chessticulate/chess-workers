const express = require('express');
const app = express();
const Chess = require('shallowpink');
const config = require('./config');
const workerpool = require('workerpool');

let poolConfig = { minWorkers: 'max' };
if (config.N_WORKERS) {
    poolConfig.maxWorkers = config.N_WORKERS;
}
const pool = workerpool.pool(__dirname + '/workers', poolConfig);

app.use(express.json());

app.post('/move', async (request, response) => {
    if (request.body.fen === undefined) {
        response.status(400).json({'message': '\'fen\' missing from request body'});
        return;
    }

    if (typeof(request.body.fen) !== 'string') {
        response.status(400).json({'message': '\'fen\' must contain a string'});
        return;
    }
    if (request.body.move === undefined) {
        response.status(400).json({'message': '\'move\' missing from request body'});
        return;
    }
    if (typeof(request.body.move) !== 'string') {
        response.status(400).json({'message': '\'move\' must contain a string'});
        return;
    }
    if (request.body.states === undefined) {
        response.status(400).json({'message': '\'states\' missing from request body'});
        return;
    }
    if (typeof(request.body.states) !== 'object') {
        response.status(400).json({'message': '\'states\' must be an object'});
        return;
    }    

    try {
        const result = await pool.exec('move', [request.body.fen, request.body.states, request.body.move]);
        if (result === null) {
            response.status(409).json({'message': 'the game is already over'});
            return;
        }
        let statusCode = [Chess.Status.INVALIDMOVE, Chess.Status.PUTSINCHECK, Chess.Status.STILLINCHECK].includes(result.message) ?
            400 : 200;
        response.status(statusCode).json(result);
    } catch(error) {
        if (error.name === 'InvalidFENException') {
            response.status(400).json({'message': 'invalid FEN string'});
            return;
        }
        console.log(error);
        response.status(500).json({ 'message': 'Internal Server Error' });
    }
});

app.post('/suggest', async (request, response) => {
    if (request.body.fen === undefined) {
        response.status(400).json({'message': '\'fen\' missing from request body'});
        return;
    }
    if (typeof(request.body.fen) !== 'string') {
        response.status(400).json({'message': '\'fen\' must contain a string'});
        return;
    }
    if (request.body.states === undefined) {
        response.status(400).json({'message': '\'states\' missing from request body'});
        return;
    }
    if (typeof(request.body.states) !== 'object') {
        response.status(400).json({'message': '\'states\' must be an object'});
        return;
    }

    try {
        const result = await pool.exec('suggest', [request.body.fen, request.body.states, config.AI_DEPTH]);
        if (result === null) {
            response.status(409).json({'message': 'the game is already over'});
            return;
        }
        response.status(200).json({ move: result });
    } catch (error) {
        if (error.name === 'InvalidFENException') {
            response.status(400).json({'message': 'invalid FEN string'});
            return;
        }
        console.log(error);
        response.status(500).json({ 'message': 'Internal Server Error' });
    }
});

module.exports = app;
