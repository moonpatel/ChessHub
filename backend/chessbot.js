const path = require("path");
const { Engine } = require("node-uci");

require("dotenv").config();
const engine = new Engine(path.join(__dirname, process.env.CHESS_ENGINE_PATH || "engine/stockfish16.exe"));

engine
    .init()
    .then((eng) => {
        return eng.setoption("UCI_LimitStrength", true);
    })
    .then((eng) => {
        eng.setoption("UCI_Elo");
    })
    .catch((err) => {
        console.error(err);
    });

const nextMove = async ({ position }) => {
    await engine.isready();
    console.log("Chess engine ready");
    engine.position(position);
    const result = await engine.go({ depth: 10 });
    console.log("Best move or position", position, "is", result.bestmove);
    return result.bestmove;
};

module.exports = { nextMove };
