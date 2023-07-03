import React, { createContext, useReducer, useRef } from 'react'
import { ChessModified, chessInit } from '../../utils/chess';
import { DISPATCH_EVENTS } from '../constants';
import ChessBoard from '../pages/Chess/ChessBoard';
const { CAPTURE_PIECE, MOVE_PIECE, SELECT_PIECE, JUMP_TO } = DISPATCH_EVENTS
export const ChessGameContext = createContext();
// myColor: null, chess: null, chessBoard: null, moveHints: null, selected: null, dispatch: null, handleOpponentMove: null, handleSquareClick: null, getSquareColor: null, isSquareMarked: null, selectPiece: null, handleDrop: null


const reducer = (state, action) => {
    console.log(state.chess.myColor)
    switch (action.type) {
        case SELECT_PIECE:
            {
                console.log('SELECTING...', action.val);
                return { ...state, moveHints: state.chess.getMoves(action.val), selected: action.val };
            }
        case MOVE_PIECE:
            {
                console.log('Moving', action.val, state.chess.turn());
                let newChessObj = new ChessModified({ prop: state.chess.fen(), color: state.chess.myColor });
                let updatedGameHistory = state.gameHistory;
                let move = newChessObj.move(action.val);
                updatedGameHistory.push({ move: move.san, fen: newChessObj.fen() });
                return { ...state, chess: newChessObj, chessBoard: newChessObj.getBoard(localStorage.getItem('myColor')), moveHints: [], selected: null, gameHistory: updatedGameHistory, currentIndex: updatedGameHistory.length - 1 };
            }
        case CAPTURE_PIECE:
            {
                console.log('Capture', action.val, state.chess.turn());
                let newChessObj = new ChessModified({ prop: state.chess.fen(), color: state.chess.myColor });
                let updatedGameHistory = state.gameHistory;
                let move = newChessObj.move(action.val);
                updatedGameHistory.push({ move: move.san, fen: newChessObj.fen() });
                return { ...state, chess: newChessObj, chessBoard: newChessObj.getBoard(localStorage.getItem('myColor')), moveHints: [], selected: null, gameHistory: updatedGameHistory, currentIndex: updatedGameHistory.length - 1 };
            }
        case JUMP_TO:
            {
                let index = action.val;
                return { ...state, currentIndex: index }
            }
        default:
            return state;
    }
}

function chessGameStateInit(myColor) {
    let chess = chessInit(myColor);
    let chessBoard = chess.getBoard(myColor);
    let moveHints = [];
    let gameHistory = [];
    let selected = null;
    let currentIndex = -1;

    return { chess, chessBoard, moveHints, selected, gameHistory, currentIndex };
}

// the ChessGameContextProvider seperates the game logic from the ChessBoard component and exposes 
// some functions to update game state.
const ChessGameContextProvider = ({ children }) => {
    let myColor = localStorage.getItem('myColor');
    console.log('INSIDE CONTEXT PROVIDER');
    const [{ chess, chessBoard, moveHints, selected, gameHistory, currentIndex }, dispatch] = useReducer(reducer, myColor, chessGameStateInit);
    console.log(gameHistory)


    console.log(gameHistory);
    const moveAudioRef = useRef(null);
    const captureAudioRef = useRef(null);
    const gameEndAudioRef = useRef(null);
    const checkAudioRef = useRef(null);

    // data received through socket
    function handleOpponentMove(data) {
        let { from, to } = data;
        console.log(from + to);
        if (!chess.get(to)) {
            console.log('Moving piece: ', data);
            dispatch({ type: MOVE_PIECE, val: { from, to } });
            moveAudioRef.current.play();
            return;
        } else {
            console.log('Capturing piece');
            dispatch({ type: CAPTURE_PIECE, val: { from, to } });
            captureAudioRef.current.play();
            return;
        }
    }

    // called when user clicks a square
    function handleSquareClick(square) {
        let { type, color } = chess.get(square);
        let marked = moveHints.includes(square);
        console.log('handleSquareClick', square)

        console.log(!type, selected, marked)
        if (chess.turn() === myColor) {
            if (type && color === myColor) {
                return dispatch({ type: SELECT_PIECE, val: square });
            }
            if (!type && selected && marked) {
                dispatch({ type: MOVE_PIECE, val: { from: selected, to: square } })
            }
            if (type && marked) {
                dispatch({ type: CAPTURE_PIECE, val: { from: selected, to: square } })
            }
        } else {
            return;
        }
    }

    function handleDrop(moveData, emitToSocketCallback) {
        let { from, to } = moveData;
        if (moveHints.includes(to)) {
            console.log(chess.get(from))
            if (chess.get(to)) {
                dispatch({ type: CAPTURE_PIECE, val: { from: from, to: to } });  // capture piece
                captureAudioRef.current.play();
                emitToSocketCallback(moveData);
            } else {
                dispatch({ type: MOVE_PIECE, val: { from: from, to: to } }); // move piece
                moveAudioRef.current.play();
                emitToSocketCallback(moveData);
            }
        }
    }

    function selectPiece({ square, type, color: pieceColor }) {
        if (pieceColor === myColor && myColor === chess.turn()) {
            console.log(square, type, pieceColor)
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
        console.log(gameHistory, currentIndex);
        if (currentIndex === -1 || gameHistory.length === 0) {
            return chessBoard;
        } else {
            let currentChessBoard = new ChessModified({ prop: gameHistory[currentIndex].fen, color: myColor }).getBoard(myColor);
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

    return (
        <ChessGameContext.Provider value={{
            myColor, chessBoard, moveHints, selected, handleOpponentMove, handleSquareClick, getSquareColor, isSquareMarked, selectPiece, handleDrop, gameHistory, jumpTo, getChessBoard, currentIndex, goAhead, goBack
        }}>
            {children}
            <audio src='/src/assets/move-self.mp3' ref={moveAudioRef} />
            <audio src='/src/assets/capture.mp3' ref={captureAudioRef} />
            <audio src='/src/assets/game-end.webm.mp3' ref={gameEndAudioRef} />
            <audio src='/src/assets/move-check.mp3' ref={checkAudioRef} />
        </ChessGameContext.Provider>
    )
}

export default ChessGameContextProvider