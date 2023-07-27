import { useReducer } from "react";

import { ChessModified, chessInit } from "../utils/chess"
import { DISPATCH_EVENTS } from "../constants";

const { SELECT_PIECE, MOVE_PIECE, CAPTURE_PIECE, SET_GAME_HISTORY } = DISPATCH_EVENTS

let BLACK = 'b', WHITE = 'w';

function chessStateInit() {
    let chess = chessInit();
    let moveHints = [];
    let gameHistory = [];
    let capturedPieces = { 'w': [], 'b': [] };
    let selected = null;
    // represents which move is viewed in history
    let currentHistoryIndex = -1;
    let hasEnded = false;

    return { chess, moveHints, selected, gameHistory, currentHistoryIndex, hasEnded, capturedPieces }
}

const reducer = (state, action) => {
    console.log(action);
    switch (action.type) {
        case SELECT_PIECE: {
            let moveHints = state.chess.getMoves(action.val);
            let selected = action.val
            return { ...state, moveHints, selected };
        }
        case MOVE_PIECE: {
            let newChess = new ChessModified(state.chess.fen());
            console.log(newChess.ascii());
            let updatedGameHistory = [...state.gameHistory];
            let { san, after } = newChess.move(action.val);
            updatedGameHistory.push({ move: san, fen: after });
            return { ...state, chess: newChess, moveHints: [], gameHistory: updatedGameHistory, currentHistoryIndex: updatedGameHistory.length - 1, selected: null };
        }
        case CAPTURE_PIECE: {
            let newChess = new ChessModified(state.chess.fen());
            let updatedGameHistory = [...state.gameHistory];
            let { san, after } = newChess.move(action.val);
            updatedGameHistory.push({ move: san, fen: after });
            return { ...state, chess: newChess, moveHints: [], gameHistory: updatedGameHistory, currentHistoryIndex: updatedGameHistory.length - 1, selected: null };
        }
        case SET_GAME_HISTORY: {
            let fetchedGameHistory = action.val;
            let newChess = new ChessModified();
            let updatedGameHistory = [];
            let capturedPieces = { 'w': [], 'b': [] }
            for (let i = 0; i < fetchedGameHistory.length; i++) {
                let { san, after, captured, color } = newChess.move(fetchedGameHistory[i]);
                updatedGameHistory.push({ fen: after, move: san });
                if (captured) {
                    color === WHITE ? capturedPieces[BLACK].push(captured) : capturedPieces[WHITE].push(captured);
                }
            }
            return { ...state, chess: newChess, gameHistory: updatedGameHistory, currentHistoryIndex: updatedGameHistory.length - 1, capturedPieces }
        }
    }
}

const useChess = () => {
    const [{ chess, moveHints, selected, gameHistory, currentHistoryIndex, capturedPieces, hasEnded }, dispatch] = useReducer(reducer, null, chessStateInit);

    function selectPiece(square) {
        dispatch({ type: SELECT_PIECE, val: square })
    }

    function movePiece(from, to) {
        dispatch({ type: MOVE_PIECE, val: { from, to } })
    }

    function capturePiece(from, to) {
        dispatch({ type: CAPTURE_PIECE, val: { from, to } })
    }

    function setGameHistory(gameHistory) {
        dispatch({ type: SET_GAME_HISTORY, val: gameHistory })
    }

    return {
        chessState: {
            chess, selected, moveHints, gameHistory, currentHistoryIndex, capturedPieces, hasEnded
        },
        chessStateModifiers: {
            selectPiece, movePiece, capturePiece, setGameHistory
        }
    }
}

export default useChess;