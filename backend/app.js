const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const roomRoutes = require("./routes/room");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
require("dotenv").config();

mongoose
    .connect("mongodb://127.0.0.1:27017/test")
    .then((res) => console.log("Connected to MongoDB"))
    .catch((err) => console.log("Error in connecting to database"));

const app = express();
const http = require("http");
const server = http.createServer(app);
const { socketIOServerInit } = require("./socket");

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(bodyParser.json());
app.use((req, res, next) => {
    // res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    // res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE");
    // res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
    next();
});
app.use(cookieParser());

socketIOServerInit(server);

app.use((req, res, next) => {
    console.log(req.url);
    next();
});

// app.use("/", (req, res, next) => res.send('Hello'));
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/room", roomRoutes);

app.use((error, req, res, next) => {
    const status = error.status || 500;
    console.log(error);
    res.status(status).json({
        userMessage: "Something went wrong",
        devMessage: error?.message || "Internal server error",
    });
});

server.listen(8080, () => {
    console.log("Listening on server 8080");
});
