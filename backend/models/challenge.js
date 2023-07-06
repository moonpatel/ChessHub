const { Schema, default: mongoose } = require("mongoose");
const { String, ObjectId, Number } = Schema.Types;

const challengeSchema = new Schema({
    challenger: {
        type: String,
        required: true,
    },
    challenged: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        enum: ["b", "w"],
        required: true,
    },
    timeLimit: {
        type: Number,
        required: true,
    },
    roomID: {
        type: String,
        required: true,
        // unique: true,
    },
});

const Challenge = mongoose.model("Challenge", challengeSchema);
module.exports = { Challenge };
