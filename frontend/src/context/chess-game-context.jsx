import React, { createContext, useReducer, useRef, useState } from 'react'

import PropTypes from 'prop-types';

import { socket } from '../socket';
import { ChessModified, chessInit } from '../utils/chess';

import { DISPATCH_EVENTS, SOCKET_EVENTS } from '../constants';
const { MOVE_PIECE, SELECT_PIECE, JUMP_TO, SET_GAME_HISTORY, END_GAME, ADD_PREMOVE, DELETE_PREMOVES } = DISPATCH_EVENTS
const { GAME_END } = SOCKET_EVENTS;

export const ChessGameContext = createContext();

const reducer = (state, action) => {
    try {
        switch (action.type) {
            case SELECT_PIECE:
                {
                    return { ...state, moveHints: state.chessCopy.getMoves(action.val), selected: action.val };
                }
            case MOVE_PIECE:
                {
                    const { from ,to } = action.val;
                    const newChessCopyObj = new ChessModified(state.chessCopy.fen());
                    let { san, after } = newChessCopyObj.move({from, to});
                    const newChessObj = new ChessModified(newChessCopyObj.fen());

                    const preMoves = [ ...state.preMoves ];
                    action.val.isPreMove && preMoves.shift();
                    preMoves.forEach(({from, to}) => {
                      const piece = newChessObj.remove(from);
                      newChessObj.put(piece, to);
                    })

                    let updatedGameHistory = state.gameHistory;
                    updatedGameHistory.push({ move: san, fen: after });
                    let newState;
                    if (newChessObj.isCheckmate()) {
                        action.val.callback();
                        action.val.playAudioCallback("CHECKMATE");
                        newState = { ...state, chess: newChessObj, chessCopy: newChessCopyObj, chessBoard: newChessObj.getBoard(), preMoves, moveHints: [], selected: null, gameHistory: updatedGameHistory, currentIndex: updatedGameHistory.length - 1, hasGameEnded: true, gameEndedReason: 'CHECKMATE' };
                    } else if(newChessObj.isCheck() || newChessObj.inCheck()) {
                        action.val.playAudioCallback("CHECK");
                        newState = { ...state, chess: newChessObj, chessCopy: newChessCopyObj, chessBoard: newChessObj.getBoard(), preMoves, moveHints: [], selected: null, gameHistory: updatedGameHistory, currentIndex: updatedGameHistory.length - 1 };
                    } else if (newChessObj.isStalemate()) {
                        action.val.callback();
                        action.val.playAudioCallback("STALEMATE");
                        newState = { ...state, chess: newChessObj, chessCopy: newChessCopyObj, chessBoard: newChessObj.getBoard(), preMoves, moveHints: [], selected: null, gameHistory: updatedGameHistory, currentIndex: updatedGameHistory.length - 1, hasGameEnded: true, gameEndedReason: 'STALEMATE' };
                    }
                    else {
                        if(!state.chess.get(action.val.to)) {
                            action.val.playAudioCallback("MOVE");
                        } else {
                            action.val.playAudioCallback("CAPTURE");
                        }
                        newState = { ...state, chess: newChessObj, chessCopy: newChessCopyObj, chessBoard: newChessObj.getBoard(), preMoves, moveHints: [], selected: null, gameHistory: updatedGameHistory, currentIndex: updatedGameHistory.length - 1 };
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
            case ADD_PREMOVE:
                {
                    const updatedPreMoves = [ ...state.preMoves, action.val ];
                    const newChessObj = new ChessModified(state.chessCopy.fen());
                    updatedPreMoves.forEach(({from, to}) => {
                        const piece = newChessObj.remove(from);
                        newChessObj.put(piece, to);
                    })
                    return { ...state, chess: newChessObj, chessBoard: newChessObj.getBoard(), preMoves: updatedPreMoves }
                }
            case DELETE_PREMOVES:
                {
                    return { ...state, chess: state.chessCopy, chessBoard: state.chessCopy.getBoard(), preMoves: [] }
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
    let chessCopy = chessInit(myColor);
    let chessBoard = chess.getBoard();
    let preMoves = [];
    let moveHints = [];
    let gameHistory = [];
    let selected = null;
    let currentIndex = -1;
    let hasGameEnded = false;
    let gameEndedReason = "";

    return { chess, chessCopy, chessBoard, preMoves, moveHints, selected, gameHistory, currentIndex, hasGameEnded, gameEndedReason };
}

// the ChessGameContextProvider seperates the game logic from the ChessBoard component and exposes 
// some functions to update game state.
const ChessGameContextProvider = ({ children }) => {
    let myColor = localStorage.getItem('myColor');
    let roomID = localStorage.getItem('roomID');
    const [{ chess, chessCopy, chessBoard, moveHints, selected, gameHistory, currentIndex, hasGameEnded, gameEndedReason, preMoves }, dispatch] = useReducer(reducer, myColor, chessGameStateInit);
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
    function handleOpponentMove(data, callback, preMoveEmitCallback) {
        let { from, to } = data;
        console.log("Opponent move:",from,to);
        dispatch({type:MOVE_PIECE,val: { from, to, callback,playAudioCallback, isPreMove: false }});
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
                dispatch({ type: MOVE_PIECE, val: { from: selectedRef.current, to: square, callback,playAudioCallback, isPreMove: false  } })
                console.log("Move:",{ from: selectedRef.current, to: square })
                emitToSocketCallback({ from: selectedRef.current, to: square })
            }
        }
    }

    function handleDrop(moveData, emitToSocketCallback, callback) {
        let { from, to } = moveData;
        const isOpponentTurn = chessCopy.turn() !== myColor;
        if (isOpponentTurn && from !== to && chess.get(from).color === myColor) {
            dispatch({ type: ADD_PREMOVE, val: {from, to}});
            return;
        }
        if (moveHintsRef.current.includes(to)) {
            dispatch({ type: MOVE_PIECE, val: { from: from, to: to, callback,playAudioCallback, isPreMove: false } });  // capture piece
            console.log("Move:",{ from,to })
            emitToSocketCallback(moveData);
        }
    }

    function handlePreMove(callback, emitMoveToSocketCallback) {
        const {from, to} = preMoves[0];
        const moveHints = chessCopy.getMoves(from);
        if(moveHints.includes(to)) {
            dispatch({ type: MOVE_PIECE, val: { from, to, isPreMove: true, callback, playAudioCallback }})
            console.log("Move:", { from, to });
            emitMoveToSocketCallback({ from, to });
        }
        else{
            dispatch({ type: DELETE_PREMOVES });
        }
    }

    function selectPiece({ square, color: pieceColor }) {
        if (pieceColor === myColor) {
            dispatch({ type: SELECT_PIECE, val: square });
        }
    }

    function getSquareColor(square) {
        return chessRef.current.squareColor(square) === 'light' ? "w" : "b";
    }

    function isSquareMarked(square) {
        return moveHintsRef.current.includes(square);
    }

    function jumpTo(index) {
        dispatch({ type: JUMP_TO, val: index })
    }

    function getChessBoard() {
        if (currentIndex === gameHistory.length - 1) {
            return chessBoard;
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
            myColor, preMoves, chess, chessCopy, chessBoard, moveHints, selected, handleOpponentMove, handleSquareClick, handlePreMove, getSquareColor, isSquareMarked,
            selectPiece, handleDrop, gameHistory, jumpTo, getChessBoard, currentIndex, goAhead, goBack, setGameHistory,
            isTimerOn, hasGameEnded, gameEndedReason, endGame,getPieceColor
        }}>
            {children}
            <audio src='/src/assets/audio/move-self.mp3' ref={moveAudioRef} />
            <audio src='/src/assets/audio/capture.mp3' ref={captureAudioRef} />
            <audio src='/src/assets/audio/game-end.webm' ref={gameEndAudioRef} />
            <audio src='/src/assets/audio/move-check.mp3' ref={checkAudioRef} />
        </ChessGameContext.Provider>
    )
}

ChessGameContextProvider.propTypes = {
    children: PropTypes.object
}

export default ChessGameContextProvider
