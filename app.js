const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

/* define API endpoints here */
app.get('/info', (request, response) => {
    response.status(200).json({"message": "hello world"});
});

module.exports = app;
