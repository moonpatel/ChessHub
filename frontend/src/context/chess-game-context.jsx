import React, { createContext, useReducer, useRef, useState } from 'react'

import PropTypes from 'prop-types';

import { socket } from '../socket';
import { ChessModified, chessInit } from '../utils/chess';

import { DISPATCH_EVENTS, SOCKET_EVENTS } from '../constants';
const { MOVE_PIECE, SELECT_PIECE, JUMP_TO, SET_GAME_HISTORY, END_GAME } = DISPATCH_EVENTS
const { GAME_END } = SOCKET_EVENTS;

export const ChessGameContext = createContext();

const reducer = (state, action) => {
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
                    let newState;
                    if (newChessObj.isCheckmate()) {
                        action.val.callback();
                        action.val.playAudioCallback("CHECKMATE");
                        newState = { ...state, chess: newChessObj, chessBoard: newChessObj.getBoard(), moveHints: [], selected: null, gameHistory: updatedGameHistory, currentIndex: updatedGameHistory.length - 1, hasGameEnded: true, gameEndedReason: 'CHECKMATE' };
                    } else if(newChessObj.isCheck() || newChessObj.inCheck()) {
                        action.val.playAudioCallback("CHECK");
                        newState = { ...state, chess: newChessObj, chessBoard: newChessObj.getBoard(), moveHints: [], selected: null, gameHistory: updatedGameHistory, currentIndex: updatedGameHistory.length - 1 };
                    } else if (newChessObj.isStalemate()) {
                        action.val.callback();
                        action.val.playAudioCallback("STALEMATE");
                        newState = { ...state, chess: newChessObj, chessBoard: newChessObj.getBoard(), moveHints: [], selected: null, gameHistory: updatedGameHistory, currentIndex: updatedGameHistory.length - 1, hasGameEnded: true, gameEndedReason: 'STALEMATE' };
                    }
                    else {
                        if(!state.chess.get(action.val.to)) {
                            action.val.playAudioCallback("MOVE");
                        } else {
                            action.val.playAudioCallback("CAPTURE");
                        }
                        newState = { ...state, chess: newChessObj, chessBoard: newChessObj.getBoard(), moveHints: [], selected: null, gameHistory: updatedGameHistory, currentIndex: updatedGameHistory.length - 1 };
                    }
                    return newState;
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
        console.error(err);
        return state;
    }
}

function chessGameStateInit(myColor) {
    let chess = chessInit(myColor);
    let chessBoard = chess.getBoard();
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

    const chessRef = useRef(chess);
    const moveHintsRef = useRef(moveHints);
    const selectedRef = useRef(selected);
    const gameHistoryRef = useRef(gameHistory);
    const currentIndexRef = useRef(currentIndex);
    chessRef.current = chess;
    selectedRef.current = selected;
    moveHintsRef.current = moveHints;
    gameHistoryRef.current = gameHistory;
    currentIndexRef.current = currentIndex;

    const moveAudioRef = useRef(null);
    const captureAudioRef = useRef(null);
    const gameEndAudioRef = useRef(null);
    const checkAudioRef = useRef(null);

    function playAudioCallback(action) {
        switch(action) {
            case "MOVE":
                moveAudioRef.current.play();
                break;
            case "CAPTURE":
                captureAudioRef.current.play();
                break;
            case "CHECK":
                checkAudioRef.current.play();
                break;
            case "CHECKMATE":
            case "STALEMATE":
            case "GAME_END":
                gameEndAudioRef.current.play();
                break;
            case "CASTLE":
                
                break;
            default:
                break;
        }
    }

    // data - received through socket
    function handleOpponentMove(data, callback) {
        let { from, to } = data;
        console.log("Opponent move:",from,to);
        dispatch({type:MOVE_PIECE,val: { from, to, callback,playAudioCallback }});
    }

    // called when user clicks a square
    function handleSquareClick(square, emitToSocketCallback, callback) {
        let { type, color } = chessRef.current.get(square);
        let marked = moveHintsRef.current.includes(square);

        if (chessRef.current.turn() === myColor) {
            if (type && color === myColor) {
                selectPiece({square,color});
                return;
            } else if(marked) {
                dispatch({ type: MOVE_PIECE, val: { from: selectedRef.current, to: square, callback,playAudioCallback } })
                console.log("Move:",{ from: selectedRef.current, to: square })
                emitToSocketCallback({ from: selectedRef.current, to: square })
            }
        }
    }

    function handleDrop(moveData, emitToSocketCallback, callback) {
        let { from, to } = moveData;
        if (moveHintsRef.current.includes(to)) {
            dispatch({ type: MOVE_PIECE, val: { from: from, to: to, callback,playAudioCallback } });  // capture piece
            console.log("Move:",{ from,to })
            emitToSocketCallback(moveData);
        }
    }

    function selectPiece({ square, color: pieceColor }) {
        if (pieceColor === myColor && myColor === chessRef.current.turn()) {
            dispatch({ type: SELECT_PIECE, val: square });
        }
    }

    function getSquareColor(square) {
        return chessRef.current.squareColor(square) === 'light' ? "w" : "b";
    }

    function isSquareMarked(square) {
        return moveHintsRef.current.includes(square);
    }

    function isLastMoveSquare(square) {
        
        if (currentIndexRef.current < 0)
            return false;
        let [lastMove] = chessRef.current.history({verbose: true}).slice(-1);
        if (square != lastMove.to && square!=lastMove.from)
            return false;
        return true;
    }

    function jumpTo(index) {
        dispatch({ type: JUMP_TO, val: index })
    }

    function getChessBoard() {
        if (currentIndexRef.current === -1 || gameHistoryRef.current.length === 0) {
            return new ChessModified().getBoard();
        } else {
            // console.log(chess);
            let currentChessBoard = new ChessModified(gameHistoryRef.current[currentIndexRef.current].fen).getBoard();
            return currentChessBoard;
        }
    }

    function goBack() {
        if (currentIndexRef.current > 0) {
            jumpTo(currentIndexRef.current - 1);
        }
    }

    function goAhead() {
        if (currentIndexRef.current < gameHistoryRef.current.length - 1) {
            jumpTo(currentIndexRef.current + 1);
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

    function getPieceColor(square) {
        return chessRef.current.get(square).color
    }

    return (
        <ChessGameContext.Provider value={{
            myColor, chess, chessBoard, moveHints, selected, handleOpponentMove, handleSquareClick, getSquareColor, isSquareMarked, isLastMoveSquare,
            selectPiece, handleDrop, gameHistory, jumpTo, getChessBoard, currentIndex, goAhead, goBack, setGameHistory,
            isTimerOn, hasGameEnded, gameEndedReason, endGame,getPieceColor
        }}>
            {children}
            <audio src='/assets/audio/move-self.mp3' ref={moveAudioRef} />
            <audio src='/assets/audio/capture.mp3' ref={captureAudioRef} />
            <audio src='/assets/audio/game-end.webm' ref={gameEndAudioRef} />
            <audio src='/assets/audio/move-check.mp3' ref={checkAudioRef} />
        </ChessGameContext.Provider>
    )
}

ChessGameContextProvider.propTypes = {
    children: PropTypes.object
}

export default ChessGameContextProvider