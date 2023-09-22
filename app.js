const express = require('express');
const app = express();
const Chess = require('shallowpink');

app.use(express.json());

/* define API endpoints here */
app.get('/info', (request, response) => {
    response.status(200).json({"message": "hello world"});
});

app.post('/move', (request, response) => {
    if (request.body.fen === undefined) {
        response.status(400).json({"message": "FEN string missing from request body"});
        return;
    }     
    if (request.body.move === undefined) {
        response.status(400).json({"message": "move string missing from request body"});
        return;
    }
    let chess;
    try {
        chess = new Chess(request.body.fen);
    } catch (error) {
        response.status(400).json({"message": "invalid FEN string"});
        return;
    }     
    let result = chess.move(request.body.move);
    
    if ([Chess.Status.INVALIDMOVE, Chess.Status.PUTSINCHECK, Chess.Status.STILLINCHECK].includes(result)) {
        response.status(400).json({"message": "invalid move string"});
        return;
    }

    response.status(200).json({"message": result}); 
});

// app.post('/suggest', (request, response) => {
//    
// }

module.exports = app;
