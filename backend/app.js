const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const mongoose = require("mongoose");

mongoose
    .connect("mongodb://127.0.0.1:27017/test")
    .then((res) => console.log("Connected to MongoDB"))
    .catch((err) => console.log("Error in connecting to database"));

const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
    // console.log("Connected: ", socket.data);
    socket.broadcast.emit("game", "emitting...");
    socket.emit("game", "Welcome");

    socket.on("join-room", async (data) => {
        if (data?.roomid) await socket.join(roomid);
        else socket.emit("error", "Room id not received");
    });

    socket.on("play", (data) => {
        console.log(data);
        let { fromRow, fromCol, toRow, toCol, room } = data;
        fromRow = 7 - fromRow;
        fromCol = 7 - fromCol;
        toRow = 7 - toRow;
        toCol = 7 - toCol;
        socket.to(room).emit("play", { fromCol, fromRow, toCol, toRow });
        socket.broadcast.emit("play", { fromCol, fromRow, toCol, toRow });
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
