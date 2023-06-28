const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const mongoose = require("mongoose");
require("dotenv").config();

mongoose
    .connect("mongodb://127.0.0.1:27017/test")
    .then((res) => console.log("Connected to MongoDB"))
    .catch((err) => console.log("Error in connecting to database"));

const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const { sendEmail } = require("./mail");
const { User } = require("./models/user");
const io = new Server(server, { cors: { origin: "*" } });

const activeRooms = new Map();
const pendingChallenges = new Map();

io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Handle join event
    socket.on("join-room", async (roomID, playerUsername, challengedPlayerUsername) => {
        // room exists
        if (activeRooms.has(roomID)) {
            socket.emit("room-full");
            return;
        } else if (pendingChallenges.has(roomID)) {
            const challenge = pendingChallenges.get(roomID);
            pendingChallenges.delete(roomID);
            let newRoom = {
                id: roomID,
                players: {
                    challenger: {
                        id: challenge.challengerID,
                        name: challenge.challengerUsername,
                    },
                    challenged: {
                        id: socket.id,
                        name: playerUsername,
                    },
                },
            };
            activeRooms.set(roomID, newRoom);
            io.to(roomID).emit("room-created");
        } else {
            // no room on pending challenges found
            const challenge = {
                roomID,
                challengerID: socket.id,
                challengerUsername: playerUsername,
                challengedUsername: challengedPlayerUsername,
            };
            pendingChallenges.set(roomID, challenge);

            console.log(challengedPlayerUsername);
            // notify the challenged player
            const email = (await User.findOne({ username: challengedPlayerUsername })).email;
            sendEmail(
                email,
                `Challenge from ${playerUsername}`,
                `To accept the challenge follow the link: http://localhost:5173/game/friend/${roomID}`
            );

            socket.emit("challenge-pending");
        }
    });

    socket.on("move", (roomID, moveData) => {
        socket.to(roomID).emit("opponent-move", moveData);
    });
});

app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
    next();
});

app.use((req, res, next) => {
    console.log(req.url);
    next();
});

// app.use("/", (req, res, next) => res.send('Hello'));
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

app.use((error, req, res, next) => {
    const status = error.status || 500;
    const message = error.message || "Something went wrong.";
    res.status(status).json({ message: message });
});

server.listen(8080, () => {
    console.log("Listening on server 8080");
});
