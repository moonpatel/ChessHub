export const SOCKET_EVENTS = {
    CONNECT: "connect",
    DISCONNECT: "disconnect",
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

export const DISPATCH_EVENTS = {
    SELECT_PIECE: "SELECT_PIECE",
    MOVE_PIECE: "MOVE_PIECE",
    CAPTURE_PIECE: "CAPTURE_PIECE",
    JUMP_TO: "JUMP_TO",
    SET_GAME_HISTORY: "SET_GAME_HISTORY",
    END_GAME: "END_GAME",
};
