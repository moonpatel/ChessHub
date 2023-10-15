const socket = require("socket.io");
const { SOCKET_EVENTS } = require("./constants");
const { Chess } = require("chess.js");
const { User } = require("./models/user");
const { Game } = require("./models/game");
const { nextMove } = require("./chessbot");
const {
    CHESS_MOVE,
    CHESS_OPPONENT_MOVE,
    JOIN_ROOM,
    JOIN_ROOM_ERROR,
    JOIN_ROOM_SUCCESS,
    ROOM_FULL,
    USER_JOINED_ROOM,
    USER_RESIGNED,
    GAME_END,
} = SOCKET_EVENTS;
// roomID => { timeLimit,gameHistory , players:{'b': {username,userid}, 'w':{username,userid} } }
let activeRooms = new Map();

// chess - chess object
// moveData - {from,to} => lan notation
function isValidMove(chess,moveData) {
    let newChess = new Chess();
    newChess.loadPgn(chess.pgn());
    try {
        newChess.move(moveData);
        return true;
    } catch(err) {
        return false;
    }
}

function createRoom(roomID, timeLimit) {
    console.log(roomID, "created");
    activeRooms.set(roomID, { timeLimit, players: {}, gameHistory: [] });
    console.log("Currently active rooms", activeRooms.size);
}

function getRoom(roomID) {
    return activeRooms.get(roomID);
}

function destoryRoom(roomID) {
    activeRooms.delete(roomID);
}

// structure of userDetails: {username,userid,color}
function addUserToRoom(roomID, socket, userDetails) {
    console.log(userDetails);
    let { username, color, userid } = userDetails;
    let room = activeRooms.get(roomID);

    if (room.players[color]) {
        room.players[color] = { username, userid, socket };
        return JOIN_ROOM_SUCCESS;
    }
    if (Object.keys(room.players).length > 1) {
        // room is full
        console.log(activeRooms);
        return ROOM_FULL;
    } else {
        room.players[color] = { username, userid, socket };
    }
    console.log(activeRooms);

    return JOIN_ROOM_SUCCESS;
}

// initialize the socket server with the given http server instance
function socketIOServerInit(server) {
    const io = new socket.Server(server, {
        cors: {
            origin: process.env.CORS_ALLOWED_HOST,
        },
    });

    const ioBot = io.of("/chessbot");

    ioBot.on("connection", (socket) => {
        let id = socket.id;
        console.log(id, "connected on /chessbot");
        const chess = new Chess();

        socket.onAny((evt) => {
            console.log(evt);
        });

        socket.on('INIT', async (data) => {
            if(data.color === 'b') {
                console.log(data.color);
                const botMove = await nextMove({position:chess.fen()});
                console.log({ from: botMove.substring(0, 2), to: botMove.substring(2) });
                chess.move({from:botMove.substring(0,2),to:botMove.substring(2)});
                setTimeout(() => {
                    socket.emit("CHESS_BOT_MOVE",{from:botMove.substring(0,2),to:botMove.substring(2)})
                }, 500);
            }
        });

        socket.on("disconnect", (reason) => {
            console.log(id, "disconnected due to", reason);
        });

        socket.on(CHESS_MOVE, async (roomID, moveData) => {
            console.log("CHESS_MOVE");
            if(!isValidMove(chess,moveData)) return;
            chess.move(moveData);
            let move = moveData.from + moveData.to;
            console.log(move);
            const botMove = await nextMove({ position: chess.fen() });
            console.log({ from: botMove.substring(0, 2), to: botMove.substring(2) });
            chess.move({ from: botMove.substring(0, 2), to: botMove.substring(2) });
            socket.emit("CHESS_BOT_MOVE", { from: botMove.substring(0, 2), to: botMove.substring(2) });
        });
    });

    io.on("connection", (socket) => {
        let id = socket.id;
        console.log(socket.id, "connected");

        socket.on("disconnect", (reason) => {
            console.log(id, "disconnected due to", reason);
        });

        // data is the metadata of the user joining the room played between the users
        // structure: {username,color}
        socket.on(JOIN_ROOM, (roomID, data) => {
            if (activeRooms.has(roomID)) {
                let result = addUserToRoom(roomID, socket, data);
                if (result === JOIN_ROOM_SUCCESS) {
                    socket.join(roomID);
                    // io.to(roomID).emit("new user joined the room");
                    console.log(data, "joined");
                    let room = getRoom(roomID);
                    socket.to(roomID).emit(USER_JOINED_ROOM, data.username);
                    socket.emit(result, room.gameHistory); // room joined successfully
                } else {
                    socket.emit(result); // room is full
                }
            } else {
                socket.emit(JOIN_ROOM_ERROR, "room does not exist");
            }
        });

        socket.on(CHESS_MOVE, (roomID, moveData) => {
            console.log(moveData);
            let room = activeRooms.get(roomID);
            room.gameHistory.push(moveData);
            socket.to(roomID).emit(CHESS_OPPONENT_MOVE, moveData);
        });

        socket.on(USER_RESIGNED, async (roomID, username) => {
            socket.to(roomID).emit(USER_RESIGNED, username);
        });

        socket.on(GAME_END, async (roomID) => {
            console.log("Ending game...");
            const room = getRoom(roomID);
            const black = room.players["b"];
            const white = room.players["w"];
            io.socketsLeave(roomID);
            black.socket.disconnect();
            white.socket.disconnect();

            // generating pgn
            let moves = room.gameHistory;
            let chess = new Chess();
            for (let move of moves) {
                let { from, to } = move;
                chess.move({ from, to });
            }
            let pgn = chess.pgn();

            const blackPlayerDoc = await User.findById(black.userid);
            const whitePlayerDoc = await User.findById(white.userid);

            let gameData = {
                white: whitePlayerDoc.id,
                black: blackPlayerDoc.id,
                timeLimit: room.timeLimit,
                roomID,
                pgn,
            };
            const gameDoc = await Game.create(gameData);

            blackPlayerDoc.games.push(gameDoc.id);
            await blackPlayerDoc.save();
            whitePlayerDoc.games.push(gameDoc.id);
            await whitePlayerDoc.save();
        });
    });
}

module.exports = {
    activeRooms,
    createRoom,
    addUserToRoom,
    socketIOServerInit,
};
