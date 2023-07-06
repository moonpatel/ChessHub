const { Schema, default: mongoose } = require("mongoose");
const { String, ObjectId, Number } = Schema.Types;

const gameSchema = new Schema({
    white: {
        type: ObjectId,
        ref: "User",
    },
    black: {
        type: ObjectId,
        ref: "User",
    },
    timeLimit: {
        type: Number,
        required: true,
    },
    roomID: {
        type: String,
        required: true,
    },
    pgn: {
        type: String,
        required: true,
    },
    winner: {
        type: String,
        enum: ["b", "w", "n"],
    },
});

const Game = mongoose.model("Game", gameSchema);
module.exports = { Game };
