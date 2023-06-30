import React, { useEffect, useReducer, useRef } from 'react';
import { ChessModified, chess } from '../../../utils/chess';
import Cell from '../../components/Cell';
import { socket } from '../../socket';
import { Flex } from '@mantine/core';
import { DndContext } from '@dnd-kit/core'

let myColor = 'w';

const reducer = (state, action) => {
    switch (action.type) {
        case 'SELECT_PIECE':
            {
                state.chess.select(action.val.square);
                return { ...state, moveHints: state.chess.getMoves(state.chess.selected) };
            }
        case 'MOVE_PIECE':
            {
                console.log('Moving', action.val, state.chess.turn());
                let newChessObj = new ChessModified(state.chess.fen())
                newChessObj.move(action.val);
                return { ...state, chess: newChessObj, chessBoard: newChessObj.getBoard(), moveHints: [] };
            }
        case 'CAPTURE_PIECE':
            {
                console.log('Capture', action.val, state.chess.turn())
                let newChessObj = new ChessModified(state.chess.fen())
                newChessObj.move(action.val);
                return { ...state, chess: newChessObj, chessBoard: newChessObj.getBoard(), moveHints: [] };
            }
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
        chess, chessBoard: chess.getBoard(), moveHints: []
    });

    const chessBoardRef = useRef(gameState.chessBoard);
    chessBoardRef.current = gameState.chessBoard;

    useEffect(() => {
        function handleOpponentMove(data) {
            let { from, to } = data;
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
            let srcSquare = evt.active.id;
            let destSquare = evt.over.id;

            if (gameState.moveHints.includes(destSquare)) {
                console.log(gameState.chess.get(srcSquare))
                if (gameState.chess.get(destSquare)) {
                    captureAudioRef.current.play();
                    dispatch({ type: 'CAPTURE_PIECE', val: { from: srcSquare, to: destSquare } });  // capture piece
                } else {
                    moveAudioRef.current.play();
                    dispatch({ type: 'MOVE_PIECE', val: { from: srcSquare, to: destSquare } }); // move piece
                }
            }
        }}>
            <Flex w="600px">
                <div>
                    {gameState.chessBoard.map((row, rowIndex) => {
                        return (
                            <Flex className='flex' key={rowIndex * 2}>
                                {row.map((cell, colIndex) => {
                                    return (
                                        <Cell
                                            key={cell.square}
                                            cell={cell}
                                            chess={chess}
                                            marked={gameState.moveHints.includes(cell.square)}
                                            dispatch={dispatch}
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