const socket = require("socket.io");

let activeRooms = new Map();

function createRoom(roomID, timeLimit) {
    console.log(roomID, "created");
    activeRooms.set(roomID, { timeLimit, players: [] });
    console.log("Currently active rooms", activeRooms.size);
}

// structure of userDetails: {username,color}
function addUserToRoom(roomID, userDetails) {
    let { username, color } = userDetails;
    let room = activeRooms.get(roomID);

    if (room.players) {
        // room is full
        if (Object.keys(room.players).length > 1) {
            return "room-full";
        } else {
            // only one user in room
            room.players[username].color = color;
        }
    } else {
        // add player in the room
        room.players = {};
        room.players[username].color = color;
    }
    return "join-room-success";
}

// initialize the socket server with the given http server instance
function socketIOServerInit(server) {
    const io = new socket.Server(server);

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
    });
}

module.exports = {
    createRoom,
    addUserToRoom,
    socketIOServerInit,
};
