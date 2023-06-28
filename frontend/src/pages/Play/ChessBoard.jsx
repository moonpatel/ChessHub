import React, { useEffect, useReducer, useRef } from 'react';
import { blackColor, chessBoardInit, getPieceHint, pieces, whiteColor } from '../../../utils/chess';
import Cell from '../../components/Cell';
import { socket } from '../../socket';
import { Flex } from '@mantine/core';

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
    const [gameState, dispatch] = useReducer(reducer, {
        chessBoard: chessBoardInit(myColor), selectedPiece: null, possibleMoves: [], capturedPieces: [], myTurn: myColor === whiteColor
    });

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
        <React.Fragment>
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
                                    return <Cell
                                        key={col * 3 + 1}
                                        selectedPiece={gameState.selectedPiece}
                                        cellProps={{ row, col, piece, marked }}
                                        dispatch={dispatch}
                                        myColor={myColor}
                                        myTurn={gameState.myTurn}
                                    />
                                })}
                            </Flex>
                        )
                    })}
                </div>
            </Flex>
        </React.Fragment>
    )
}

export default ChessBoard