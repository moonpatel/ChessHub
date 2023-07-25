import React, { useContext, useEffect } from 'react';

import { Flex, createStyles } from '@mantine/core';
import { DndContext } from '@dnd-kit/core'

import Cell from '../../components/Cell';
import { ChessGameContext } from '../../context/chess-game-context';
import { socket } from '../../socket';
import { SOCKET_EVENTS } from '../../constants';
const { CHESS_OPPONENT_MOVE, CHESS_MOVE } = SOCKET_EVENTS

const useStyles = createStyles((theme) => ({
    chessboard: {
        [theme.fn.largerThan('md')]: {
            width: '600px'
        },

        [theme.fn.smallerThan('md')]: {
            width: '560px'
        },
        [theme.fn.smallerThan('sm')]: {
            width: '360px',
        },
    },
    boardrow: {
        [theme.fn.largerThan('md')]: {
            height: '75px'
        },
        [theme.fn.smallerThan('md')]: {
            height: '70px'
        },
        [theme.fn.smallerThan('sm')]: {
            height: '45px'
        },
    }
}))

const ChessBoard = () => {
    const { classes } = useStyles();
    const { getChessBoard, handleOpponentMove, handleDrop, hasGameEnded, gameEndedReason } = useContext(ChessGameContext)
    const roomID = localStorage.getItem('roomID');
    const chessBoard = getChessBoard();
    const myColor = localStorage.getItem('myColor')

    useEffect(() => {
        socket.on(CHESS_OPPONENT_MOVE, handleOpponentMove)

        return () => {
            socket.off(CHESS_OPPONENT_MOVE);
        }
    }, []);

    if (myColor === 'w') {
        return (
            <DndContext onDragEnd={evt => {
                let from = evt.active.id;
                let to = evt.over.id;
                handleDrop({ from, to });
            }}>
                <Flex className={classes.chessboard} sx={{ userSelect: 'none' }}>
                    <div>
                        {chessBoard.map((row, rowIndex) => {
                            return (
                                <Flex className={classes.boardrow} key={rowIndex * 2}>
                                    {row.map(cell => <Cell key={cell.square} cell={cell} />)}
                                </Flex>
                            )
                        })}
                    </div>
                </Flex>
            </DndContext>
        )
    } else {
        return (
            <DndContext onDragEnd={evt => {
                let from = evt.active.id;
                let to = evt.over.id;
                handleDrop({ from, to }, (moveData) => {
                    socket.emit(CHESS_MOVE, roomID, moveData);
                })
            }}>
                <Flex className={classes.chessboard}>
                    <div>
                        {chessBoard.map((row, rowIndex) => {
                            return (
                                <Flex className={classes.boardrow} key={rowIndex * 2}>
                                    {row.map(cell => <Cell key={cell.square} cell={cell} />).reverse()}
                                </Flex>
                            )
                        }).reverse()}
                    </div>
                </Flex>
            </DndContext>
        )
    }
}

export default ChessBoard