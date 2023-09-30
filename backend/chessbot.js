const chess = require("chess.js");
const { Engine } = require("node-uci");

const engine = new Engine(
    process.env.CHESS_ENGINE_PATH ||
        "C:\\Users\\MOON\\Downloads\\stockfish-windows-x86-64-avx2\\stockfish\\stockfish-windows-x86-64-avx2.exe"
);

engine.init().then(() => {
    nextMove({ position: "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3" });
});

const nextMove = async ({ position }) => {
    await engine.isready();
    console.log("Chess engine ready");
    engine.position(position);
    const result = await engine.go({ depth: 22 });
    console.log("Best move or position", position, "is", result.bestmove);
};

module.exports = {};
