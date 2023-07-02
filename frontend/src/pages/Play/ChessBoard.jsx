import React, { useEffect, useReducer, useRef } from 'react';
import { ChessModified, chess, chessInit } from '../../../utils/chess';
import Cell from '../../components/Cell';
import { socket } from '../../socket';
import { Flex } from '@mantine/core';
import { DndContext } from '@dnd-kit/core'


const reducer = (state, action) => {
    console.log(state.chess.myColor)
    switch (action.type) {
        case 'SELECT_PIECE':
            {
                if (state.chess.turn() !== localStorage.getItem('myColor')) return state;
                state.chess.select(action.val.square);
                return { ...state, moveHints: state.chess.getMoves(state.chess.selected) };
            }
        case 'MOVE_PIECE':
            {
                console.log('Moving', action.val, state.chess.turn());
                let newChessObj = new ChessModified({ prop: state.chess.fen(), color: state.chess.myColor })
                newChessObj.move(action.val);
                return { ...state, chess: newChessObj, chessBoard: newChessObj.getBoard(localStorage.getItem('myColor')), moveHints: [] };
            }
        case 'CAPTURE_PIECE':
            {
                console.log('Capture', action.val, state.chess.turn())
                let newChessObj = new ChessModified({ prop: state.chess.fen(), color: state.chess.myColor });
                newChessObj.move(action.val);
                return { ...state, chess: newChessObj, chessBoard: newChessObj.getBoard(localStorage.getItem('myColor')), moveHints: [] };
            }
        default:
            return state;
    }
}

const ChessBoard = ({ color }) => {
    const moveAudioRef = useRef(null);
    const captureAudioRef = useRef(null);
    const gameEndAudioRef = useRef(null);
    const checkAudioRef = useRef(null);

    let roomID = localStorage.getItem('roomID');

    const [gameState, dispatch] = useReducer(reducer, {
        chess: chessInit(color), chessBoard: chess.getBoard(color), moveHints: []
    });

    const chessBoardRef = useRef(gameState.chessBoard);
    chessBoardRef.current = gameState.chessBoard;

    useEffect(() => {
        function handleOpponentMove(data) {
            let { from, to } = data;
            console.log(from + to)
            if (!gameState.chess.get(to)) {
                console.log('Moving piece: ', data)
                dispatch({ type: 'MOVE_PIECE', val: { from, to } });
                moveAudioRef.current.play();
                return;
            } else {
                console.log('Capturing piece');
                dispatch({ type: 'CAPTURE_PIECE', val: { from, to } });
                captureAudioRef.current.play();
                return;
            }
        }
        socket.on('opponent-move', handleOpponentMove)

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
                    socket.emit('move', roomID, { from: srcSquare, to: destSquare })
                } else {
                    moveAudioRef.current.play();
                    dispatch({ type: 'MOVE_PIECE', val: { from: srcSquare, to: destSquare } }); // move piece
                    socket.emit('move', roomID, { from: srcSquare, to: destSquare })
                }
            }
        }}>
            <Flex w="600px">
                <div>
                    {gameState.chessBoard.map((row, rowIndex) => {
                        return (
                            <Flex className='flex' key={rowIndex * 2}>
                                {row.map((cell) => {
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