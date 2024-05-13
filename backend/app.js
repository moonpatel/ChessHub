const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const roomRoutes = require("./routes/room");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const MODE = process.env.MODE || "DEV"
const port = process.env.PORT;

mongoose
    .connect(process.env.CONNECTION_STRING)
    .then((res) => console.log("Connected to MongoDB"))
    .catch((err) => console.log("Error in connecting to database"));

const app = express();
const http = require("http");
const server = http.createServer(app);
const { socketIOServerInit } = require("./socket");

app.get("/health-check", (req, res, next) => {
    res.status(200).send("OK");
});
app.use(cors({ origin: process.env.CORS_ALLOWED_HOST, credentials: true }));
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

if (MODE=="PROD") {
    console.log('Hello')
    app.use(express.static('../frontend/dist'));
    app.get("/*", (req,res,next) => {
        try {
            res.sendFile(path.join(__dirname,"../frontend/dist/index.html"))
        } catch(err) {
            next(err)
        }
    })
}

app.use((error, req, res, next) => {
    const status = error.status || 500;
    console.log(error);
    res.status(status).json({
        message: "Something went wrong",
        description: error?.message || "Internal server error",
    });
});

server.listen(port, () => {
    console.log("Listening on server", port);
});
