import { io } from "socket.io-client";
const url = import.meta.env.VITE_BACKEND_HOST;
export const socket = io(url, { autoConnect: false });
export const socketBot = io(url + "/chessbot", { autoConnect: false });
