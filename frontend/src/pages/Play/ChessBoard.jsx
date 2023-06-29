import React, { useEffect, useReducer, useRef } from 'react';
import { blackColor, chessBoardInit, getPieceHint, pieces, whiteColor } from '../../../utils/chess';
import Cell from '../../components/Cell';
import { socket } from '../../socket';
import { Flex } from '@mantine/core';
import { DndContext } from '@dnd-kit/core'


let myColor = 'W';

const reducer = (state, action) => {
    if (state.capturedPieces.length && state.capturedPieces.at(-1).type === pieces.king) return state;
    switch (action.type) {
        case 'SELECT_PIECE':
            {
                let { row, col, color } = action.val;
                let selectedPiece = { row, col, color };
                let possibleMoves = getPieceHint(state.chessBoard, { row, col, color, type: state.chessBoard[row][col].type }, color).movePos;
                return { ...state, selectedPiece, possibleMoves };
            }
            break;
        case 'MOVE_PIECE':
            {
                let { fromRow, fromCol, toRow, toCol } = action.val;
                let newChessBoard = state.chessBoard.map(row => row.slice());
                let piece = state.chessBoard[fromRow][fromCol];
                newChessBoard[toRow][toCol] = piece;
                newChessBoard[fromRow][fromCol] = null;
                return { ...state, chessBoard: newChessBoard, possibleMoves: [], selectedPiece: null, myTurn: !state.myTurn };
            }
            break;
        case 'CAPTURE_PIECE':
            {
                let { fromRow, fromCol, toRow, toCol } = action.val;
                let newChessBoard = state.chessBoard.map(row => row.slice());
                let capturedPieces = [...state.capturedPieces, state.chessBoard[toRow][toCol]];
                newChessBoard[toRow][toCol] = state.chessBoard[fromRow][fromCol];
                newChessBoard[fromRow][fromCol] = null;
                return { ...state, chessBoard: newChessBoard, capturedPieces, possibleMoves: [], selectedPiece: null, myTurn: !state.myTurn };
            }
            break;
        default:
            return state;
    }
}

const ChessBoard = () => {
    const moveAudioRef = useRef(null);
    const captureAudioRef = useRef(null);
    const gameEndAudioRef = useRef(null);
    const checkAudioRef = useRef(null);

    const [gameState, dispatch] = useReducer(reducer, {
        chessBoard: chessBoardInit(myColor), selectedPiece: null, possibleMoves: [], capturedPieces: [], myTurn: myColor === whiteColor
    });
    // console.log(gameState)

    const chessBoardRef = useRef(gameState.chessBoard);
    chessBoardRef.current = gameState.chessBoard;

    useEffect(() => {
        function handleOpponentMove(data) {
            let { fromCol, fromRow, toCol, toRow } = data;
            if (chessBoardRef.current[toRow][toCol] === null) {
                console.log('Moving piece: ', data)
                dispatch({ type: 'MOVE_PIECE', val: { fromRow, fromCol, toRow, toCol } });
            } else if (myColor === chessBoardRef.current[toRow][toCol].color) {
                dispatch({ type: 'CAPTURE_PIECE', val: { fromRow, fromCol, toRow, toCol } });
            }
        }
        socket.on('move', handleOpponentMove)

        return () => {
            socket.off('move', handleOpponentMove);
        }
    }, []);

    return (
        <DndContext onDragEnd={evt => {
            let [currentRow, currentCol] = evt.active.id.split('-');
            let [targetRow, targetCol] = evt.over.id.split('-');
            let piece = evt.active.data.current;
            if (gameState.chessBoard[targetRow][targetCol] && gameState.chessBoard[targetRow][targetCol]?.color !== myColor) {
                console.log('Captured by dragging');
                let payload = { fromRow: currentRow, fromCol: currentCol, toRow: targetRow, toCol: targetCol, color: piece.color };
                socket.emit('move', payload);
                captureAudioRef.current.play();
                dispatch({ type: 'CAPTURE_PIECE', val: payload })  // capture piece
                return;
            }
            let targetMarked = false;
            gameState.possibleMoves.forEach((move) => {
                if (move.row == targetRow && move.col == targetCol)
                    targetMarked = true;
            });
            if (targetMarked) {
                console.log('Moved by dragging')
                let payload = { fromRow: currentRow, fromCol: currentCol, toRow: targetRow, toCol: targetCol };
                socket.emit('move', payload);
                moveAudioRef.current.play();
                dispatch({ type: 'MOVE_PIECE', val: payload, }); // move piece
                return;
            }
        }}>
            <Flex w="600px">
                <div>
                    {gameState.chessBoard.map((line, row) => {
                        return (
                            <Flex className='flex' key={row * 2}>
                                {line.map((cell, col) => {
                                    let marked = null;
                                    for (let k = 0; k < gameState.possibleMoves.length; k++) {
                                        if (gameState.possibleMoves[k].row === row && gameState.possibleMoves[k].col === col) {
                                            marked = true;
                                            break;
                                        }
                                    }
                                    let piece = cell ? { type: cell.type, color: cell.color } : null;
                                    return (
                                        <Cell
                                            key={col * 3 + 1}
                                            selectedPiece={gameState.selectedPiece}
                                            cellProps={{ row, col, piece, marked }}
                                            dispatch={dispatch}
                                            myColor={myColor}
                                            myTurn={gameState.myTurn}
                                        />)
                                })}
                            </Flex>
                        )
                    })}
                </div>
            </Flex>
            <audio src='/src/assets/move-self.mp3' ref={moveAudioRef} />
            <audio src='/src/assets/capture.mp3' ref={captureAudioRef} />
            <audio src='/src/assets/game-end.webm.mp3' ref={gameEndAudioRef} />
            <audio src='/src/assets/move-check.mp3' ref={checkAudioRef} />
        </DndContext>
    )
}

export default ChessBoard