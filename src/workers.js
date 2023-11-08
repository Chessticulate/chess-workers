const workerpool = require('workerpool');
const Chess = require('shallowpink');

function suggest(fen, states, depth) {
    let chess = new Chess(fen, states);

    // if chess game is over return false
    if (chess.gameOver) {
        return null;
    }

    return chess.suggestMove(depth);
}

function move(fen, states, moveStr) {
    const chess = new Chess(fen, states);

    if (chess.gameOver) {
        return null;
    }

    const status = chess.move(moveStr);

    if ([Chess.Status.INVALIDMOVE, Chess.Status.PUTSINCHECK, Chess.Status.STILLINCHECK].includes(status)) {
        return { message: status };
    }
    return {status: status, fen: chess.toFEN(), states: chess.states};
}

// create a worker and register public functions
workerpool.worker({
    suggest: suggest,
    move: move
});