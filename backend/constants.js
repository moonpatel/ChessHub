const SOCKET_EVENTS = {
    CONNECTION: "connection",
    JOIN_ROOM: "join-room",
    JOIN_ROOM_SUCCESS: "join-room-success",
    JOIN_ROOM_ERROR: "join-room-error",
    ROOM_FULL: "room-full",
    CHESS_MOVE: "move",
    CHESS_OPPONENT_MOVE: "opponent-move",
    USER_JOINED_ROOM: "user-joined-room",
    USER_RESIGNED: "user-resigned",
    GAME_END: "game-end",
};

module.exports = {
    SOCKET_EVENTS,
};
