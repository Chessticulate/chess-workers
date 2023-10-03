const express = require('express');
const app = express();
const Chess = require('shallowpink');
const workers = require('./workers');
const config = require('./config');

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
    let result = await workers.move(request.body.fen, request.body.states, request.body.move);

    if (result === null) {
        response.status(400).json({'message': 'invalid FEN string'});
        return;
    }
    
    if ([Chess.Status.INVALIDMOVE, Chess.Status.PUTSINCHECK, Chess.Status.STILLINCHECK].includes(result)) {
        response.status(400).json({'message': result});
        return;
    }

    response.status(200).json({'message': result, 'fen': chess.toFEN(), 'states': chess.states}); 
});

app.post('/suggest', (request, response) => {
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

    let chess;
    try {
        chess = new Chess(request.body.fen, request.body.states);
    } catch (error) {
        response.status(400).json({'message': 'invalid FEN string'});
        return;
    }

    if (chess.gameOver) {
        response.status(409).json({'message': 'the game is already over'});
        return;
    }
    
    console.log(config.AI_DEPTH);
    
    let suggestedMove = chess.suggestMove(config.AI_DEPTH);

    response.status(200).json({ 'move': suggestedMove });
});

module.exports = app;
