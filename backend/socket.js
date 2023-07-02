const socket = require("socket.io");

// roomID => { timeLimit, players:[{username: {color}}] }
let activeRooms = new Map();

function createRoom(roomID, timeLimit) {
    console.log(roomID, "created");
    activeRooms.set(roomID, { timeLimit, players: {} });
    console.log("Currently active rooms", activeRooms.size);
}

// structure of userDetails: {username,color}
function addUserToRoom(roomID, userDetails) {
    console.log(userDetails);
    let { username, color } = userDetails;
    let room = activeRooms.get(roomID);

    if (room.players[username]) {
        room.players[username] = { color };
        return "join-room-success";
    }
    if (Object.keys(room.players).length > 1) {
        // room is full
        console.log(activeRooms);
        return "room-full";
    } else {
        room.players[username] = { color };
    }
    console.log(activeRooms);

    return "join-room-success";
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
        socket.on("join-room", (roomID, data) => {
            if (activeRooms.has(roomID)) {
                let result = addUserToRoom(roomID, data);
                if (result === "join-room-success") {
                    socket.join(roomID);
                    io.to(roomID).emit("new user joined the room");
                    socket.emit(result); // room joined successfully
                } else {
                    socket.emit(result); // room is full
                }
            } else {
                socket.emit("join-room-error", "room does not exist");
            }
        });

        socket.on("move", (roomID, moveData) => {
            socket.to(roomID).emit("opponent-move", moveData);
        });
    });
}

module.exports = {
    createRoom,
    addUserToRoom,
    socketIOServerInit,
};
