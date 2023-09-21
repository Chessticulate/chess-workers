const supertest = require('supertest');
const app = require('../app');

let api = supertest(app);


describe('POST /move', () => {
    test('returns 400 when no fen string or move string provided', async () => {
        const response = await api.post('/move').send({});
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('FEN string missing from request body');
    });
    test('returns 400 when only fen string provided', async () => {
        const response = await api.post('/move').send({ fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' });
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('move string missing from request body');
    });
    test('returns 400 when only move string provided', async () => {
        const response = await api.post('/move').send({ move: 'e4' });
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('FEN string missing from request body');
    });
    test('returns 400 when FEN string is invalid', async () => {
        const response = await api.post('/move').send({ fen: 'abcdefghijkl', move: 'e4' });
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('invalid FEN string');
    });
    test('returns 400 when move string is invalid', async () => {
        const response = await api.post('/move').send({ fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', move: 'easdfasdf4' });
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('invalid move string');
    });
    test('returns 200 when given valid FEN and move string', async () => {
        const response = await api.post('/move').send({ fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', move: 'e4' });
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('move ok');
    });
});


describe('POST /suggest', () => {
    it('returns 400 when no FEN string provided', async () => {
        const response = await api.post('/suggest').send({});
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('FEN string missing from request body');
    });
    it('returns 400 when given invalid fen string', async () => {
        const response = await api.post('/suggest').send({ fen: 'asdadsfasdf' });
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('invalid FEN string');
    });
    it('when given a valid FEN string, returns 200, move string, and resulting FEN string', async () => {
        const response = await api.post('/suggest').send({ fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' });
        expect(response.statusCode).toBe(200);
        expect(response.body.move instanceof String).toBe(true);
    });
    it('returns 409 when game is over and any move is attempted', async () => {
        const response = await api.post('/suggest').send({ fen: 'rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 1 3' });
        expect(response.statusCode).toBe(409);
        expect(response.body.message).toBe('the game is already over');
    });
});

