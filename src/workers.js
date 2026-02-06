const workerpool = require('workerpool');
const Chess = require('shallowpink');

function move(fen, states, moveStr) {
    // convert incoming states object -> Map<bigint, number>
    const stateMap = new Map(
        Object.entries(states ?? {}).map(([k, v]) => [BigInt(k), v])
    );

    const chess = new Chess(fen, stateMap);

    if (chess.gameOver) return null;

    const status = chess.move(moveStr);

    if (
        [Chess.Status.INVALIDMOVE, Chess.Status.PUTSINCHECK, Chess.Status.STILLINCHECK]
            .includes(status)
    ) {
        return { message: status };
    }

    // convert Map<bigint, number> -> JSON-safe object
    const outStates = {};
    for (const [k, v] of chess.states.entries()) {
        outStates[k.toString()] = v;
    }

    return {
        status,
        fen: chess.toFEN(),
        states: outStates,
    };
}

function suggest(fen, states, depth) {
    const stateMap = new Map(
        Object.entries(states ?? {}).map(([k, v]) => [BigInt(k), v])
    );

    const chess = new Chess(fen, stateMap);

    if (chess.gameOver) return null;

    return chess.suggestMove(depth);
}

workerpool.worker({ move, suggest });

