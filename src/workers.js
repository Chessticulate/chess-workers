const workerpool = require('workerpool');
const pool = workerpool.pool();
const Chess = require('shallowpink');

const move = async (fen, states, moveStr) => {
    return await pool.exec((fen, states, moveStr) => {
        let chess;
        try {
            chess = new Chess(fen, states);
        } catch (error) {
            return null;
        }
        return chess.move(moveStr); 
    }, [fen, states, moveStr]);
}

module.exports = {move};
