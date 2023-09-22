const express = require('express');
const app = express();
const cors = require('cors');
const chess = require('ShallowPink');



app.use(cors());
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
    // if (request.body.move)
    // const chess = new Chess();
        
}

module.exports = app;
