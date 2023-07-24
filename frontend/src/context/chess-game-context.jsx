import React, { createContext, useReducer, useRef, useState } from 'react'
import { ChessModified, chessInit } from '../utils/chess';
import { DISPATCH_EVENTS, SOCKET_EVENTS } from '../constants';
import { socket } from '../socket';
const { CAPTURE_PIECE, MOVE_PIECE, SELECT_PIECE, JUMP_TO, SET_GAME_HISTORY, END_GAME } = DISPATCH_EVENTS
const { GAME_END, CHESS_MOVE } = SOCKET_EVENTS;
export const ChessGameContext = createContext();
// myColor: null, chess: null, chessBoard: null, moveHints: null, selected: null, dispatch: null, handleOpponentMove: null, handleSquareClick: null, getSquareColor: null, isSquareMarked: null, selectPiece: null, handleDrop: null


const reducer = (state, action) => {
    // console.log('Before', state);
    try {
        switch (action.type) {
            case SELECT_PIECE:
                {
                    if (state.chess.turn() === state.chess.myColor && state.currentIndex < state.gameHistory.length - 1) return { ...state, currentIndex: state.gameHistory.length - 1 }
                    return { ...state, moveHints: state.chess.getMoves(action.val), selected: action.val };
                }
            case MOVE_PIECE:
                {
                    let newChessObj = new ChessModified(state.chess.fen());
                    let updatedGameHistory = state.gameHistory;
                    let { san, after } = newChessObj.move(action.val);
                    updatedGameHistory.push({ move: san, fen: after });
                    if (newChessObj.isCheckmate()) {
                        socket.emit(GAME_END, localStorage.getItem('roomID'));
                        return { ...state, chess: newChessObj, chessBoard: newChessObj.getBoard(), moveHints: [], selected: null, gameHistory: updatedGameHistory, currentIndex: updatedGameHistory.length - 1, hasGameEnded: true, gameEndedReason: 'CHECKMATE' };
                    } else if (newChessObj.isStalemate()) {
                        socket.emit(GAME_END, localStorage.getItem('roomID'));
                        return { ...state, chess: newChessObj, chessBoard: newChessObj.getBoard(), moveHints: [], selected: null, gameHistory: updatedGameHistory, currentIndex: updatedGameHistory.length - 1, hasGameEnded: true, gameEndedReason: 'STALEMATE' };
                    }
                    else {
                        return { ...state, chess: newChessObj, chessBoard: newChessObj.getBoard(), moveHints: [], selected: null, gameHistory: updatedGameHistory, currentIndex: updatedGameHistory.length - 1 };
                    }
                }
            case CAPTURE_PIECE:
                {
                    let newChessObj = new ChessModified(state.chess.fen());
                    let updatedGameHistory = state.gameHistory;
                    let { san, after } = newChessObj.move(action.val);
                    updatedGameHistory.push({ move: san, fen: after });
                    if (newChessObj.isCheckmate()) {
                        socket.emit(GAME_END, localStorage.getItem('roomID'));
                        return { ...state, chess: newChessObj, chessBoard: newChessObj.getBoard(), moveHints: [], selected: null, gameHistory: updatedGameHistory, currentIndex: updatedGameHistory.length - 1, hasGameEnded: true, gameEndedReason: 'CHECKMATE' };
                    } else if (newChessObj.isStalemate()) {
                        socket.emit(GAME_END, localStorage.getItem('roomID'));
                        return { ...state, chess: newChessObj, chessBoard: newChessObj.getBoard(), moveHints: [], selected: null, gameHistory: updatedGameHistory, currentIndex: updatedGameHistory.length - 1, hasGameEnded: true, gameEndedReason: 'STALEMATE' };
                    }
                    else {
                        return { ...state, chess: newChessObj, chessBoard: newChessObj.getBoard(), moveHints: [], selected: null, gameHistory: updatedGameHistory, currentIndex: updatedGameHistory.length - 1 };
                    }
                }
            case JUMP_TO:
                {
                    let index = action.val;
                    return { ...state, currentIndex: index }
                }
            case SET_GAME_HISTORY:
                {
                    let fetchedGameHistory = action.val;
                    let newChessObj = new ChessModified();
                    let updatedGameHistory = [];
                    for (let i = 0; i < fetchedGameHistory.length; i++) {
                        let { san, after } = newChessObj.move(fetchedGameHistory[i]);
                        updatedGameHistory.push({ fen: after, move: san })
                    }
                    return { ...state, chess: newChessObj, chessBoard: newChessObj.getBoard(), gameHistory: updatedGameHistory, currentIndex: updatedGameHistory.length - 1 }
                }
            case END_GAME:
                {
                    return { ...state, hasGameEnded: true, gameEndedReason: action.val }
                }
            default:
                return state;
        }
    } catch (err) {
        console.log('Error', err);
        console.log('After', state);
        // state.chess.getBoard()
    }
    // console.log('After', state);
    return state;
}

function chessGameStateInit(myColor) {
    let chess = chessInit(myColor);
    let chessBoard = chess.getBoard()
    let moveHints = [];
    let gameHistory = [];
    let selected = null;
    let currentIndex = -1;
    let hasGameEnded = false;
    let gameEndedReason = "";

    return { chess, chessBoard, moveHints, selected, gameHistory, currentIndex, hasGameEnded, gameEndedReason };
}

// the ChessGameContextProvider seperates the game logic from the ChessBoard component and exposes 
// some functions to update game state.
const ChessGameContextProvider = ({ children }) => {
    let myColor = localStorage.getItem('myColor');
    let roomID = localStorage.getItem('roomID');
    const [{ chess, chessBoard, moveHints, selected, gameHistory, currentIndex, hasGameEnded, gameEndedReason }, dispatch] = useReducer(reducer, myColor, chessGameStateInit);
    const [isTimerOn, setIsTimerOn] = useState(true);


    const moveAudioRef = useRef(null);
    const captureAudioRef = useRef(null);
    const gameEndAudioRef = useRef(null);
    const checkAudioRef = useRef(null);

    // data received through socket
    function handleOpponentMove(data) {
        let { from, to } = data;
        console.log(from, to, chess.get(to), chess.ascii());
        if (!chess.get(to)) {
            dispatch({ type: MOVE_PIECE, val: { from, to } });
            moveAudioRef.current.play();
            console.log(chess.ascii())
            return;
        } else {
            dispatch({ type: CAPTURE_PIECE, val: { from, to } });
            captureAudioRef.current.play();
            console.log(chess.ascii())
            return;
        }
    }

    // called when user clicks a square
    function handleSquareClick(square, emitToSocketCallback) {
        let { type, color } = chess.get(square);
        let marked = moveHints.includes(square);

        if (chess.turn() === myColor) {
            if (type && color === myColor) {
                return dispatch({ type: SELECT_PIECE, val: square });
            }
            if (!type && selected && marked) {
                dispatch({ type: MOVE_PIECE, val: { from: selected, to: square } })
                emitToSocketCallback({ from: selected, to: square })
                setIsTimerOn(false)
                captureAudioRef.current.play();
            }
            if (type && marked) {
                dispatch({ type: CAPTURE_PIECE, val: { from: selected, to: square } })
                emitToSocketCallback({ from: selected, to: square })
                setIsTimerOn(false);
                moveAudioRef.current.play();
            }
        } else {
            return;
        }
    }

    function handleDrop(moveData) {
        let { from, to } = moveData;
        // console.log(from, to, ch ess.get(to), chess.ascii())
        if (moveHints.includes(to)) {
            if (chess.get(to)) {
                dispatch({ type: CAPTURE_PIECE, val: { from: from, to: to } });  // capture piece
                captureAudioRef.current.play();
                // setIsTimerOn(false)
                socket.emit(CHESS_MOVE, roomID, moveData);
            } else {
                dispatch({ type: MOVE_PIECE, val: { from: from, to: to } }); // move piece
                moveAudioRef.current.play();
                // setIsTimerOn(false)
                socket.emit(CHESS_MOVE, roomID, moveData);
            }
        }
    }

    function selectPiece({ square, color: pieceColor }) {
        if (pieceColor === myColor && myColor === chess.turn()) {
            dispatch({ type: SELECT_PIECE, val: square });
        }
    }

    function getSquareColor(square) {
        return chess.squareColor(square) === 'light' ? "w" : "b";
    }

    function isSquareMarked(square) {
        return moveHints.includes(square);
    }

    function jumpTo(index) {
        dispatch({ type: JUMP_TO, val: index })
    }

    function getChessBoard() {
        if (currentIndex === -1 || gameHistory.length === 0) {
            return new ChessModified().getBoard();
        } else {
            // console.log(chess);
            let currentChessBoard = new ChessModified(gameHistory[currentIndex].fen).getBoard();
            return currentChessBoard;
        }
    }

    function goBack() {
        if (currentIndex > 0) {
            jumpTo(currentIndex - 1);
        }
    }

    function goAhead() {
        if (currentIndex < gameHistory.length - 1) {
            jumpTo(currentIndex + 1);
        }
    }

    // fetchedGameHistory is an array of objects of the form {from,to}
    function setGameHistory(fetchedGameHistory) {
        dispatch({ type: SET_GAME_HISTORY, val: fetchedGameHistory })
    }

    function endGame(reason) {
        dispatch({ type: END_GAME, val: reason })
        socket.emit(GAME_END, roomID);
    }

    return (
        <ChessGameContext.Provider value={{
            myColor, chess, chessBoard, moveHints, selected, handleOpponentMove, handleSquareClick, getSquareColor, isSquareMarked,
            selectPiece, handleDrop, gameHistory, jumpTo, getChessBoard, currentIndex, goAhead, goBack, setGameHistory,
            isTimerOn, hasGameEnded, gameEndedReason, endGame
        }}>
            {children}
            <audio src='/src/assets/audio/move-self.mp3' ref={moveAudioRef} />
            <audio src='/src/assets/audio/capture.mp3' ref={captureAudioRef} />
            <audio src='/src/assets/audio/game-end.webm.mp3' ref={gameEndAudioRef} />
            <audio src='/src/assets/audio/move-check.mp3' ref={checkAudioRef} />
        </ChessGameContext.Provider>
    )
}

export default ChessGameContextProvider