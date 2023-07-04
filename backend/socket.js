const socket = require("socket.io");
const { SOCKET_EVENTS } = require("./constants");
const { CHESS_MOVE, CHESS_OPPONENT_MOVE, CONNECTION, JOIN_ROOM, JOIN_ROOM_ERROR, JOIN_ROOM_SUCCESS, ROOM_FULL } =
    SOCKET_EVENTS;
// roomID => { timeLimit,gameHistory , players:[{username: {color}}] }
let activeRooms = new Map();

function createRoom(roomID, timeLimit) {
    console.log(roomID, "created");
    activeRooms.set(roomID, { timeLimit, players: {}, gameHistory: [] });
    console.log("Currently active rooms", activeRooms.size);
}

function getRoom(roomID) {
    return activeRooms.get(roomID);
}

// structure of userDetails: {username,color}
function addUserToRoom(roomID, userDetails) {
    console.log(userDetails);
    let { username, color } = userDetails;
    let room = activeRooms.get(roomID);

    if (room.players[username]) {
        room.players[username] = { color };
        return JOIN_ROOM_SUCCESS;
    }
    if (Object.keys(room.players).length > 1) {
        // room is full
        console.log(activeRooms);
        return ROOM_FULL;
    } else {
        room.players[username] = { color };
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
                let result = addUserToRoom(roomID, data);
                if (result === JOIN_ROOM_SUCCESS) {
                    socket.join(roomID);
                    io.to(roomID).emit("new user joined the room");
                    console.log(data, "joined");
                    let room = getRoom(roomID);
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
    });
}

module.exports = {
    createRoom,
    addUserToRoom,
    socketIOServerInit,
};
