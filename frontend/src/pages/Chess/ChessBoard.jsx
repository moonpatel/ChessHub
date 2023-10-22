import React, { useContext, useEffect } from 'react';

import { Flex, createStyles } from '@mantine/core';
import { DndContext } from '@dnd-kit/core'

import Cell from '../../components/Cell';
import { ChessGameContext } from '../../context/chess-game-context';
import { socket } from '../../socket';
import { SOCKET_EVENTS } from '../../constants';
const { GAME_END } = SOCKET_EVENTS

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

const ChessBoard = ({ callbacks }) => {
    const { classes } = useStyles();
    const { getChessBoard, handleDrop,selected,selectPiece,getPieceColor } = useContext(ChessGameContext)
    const chessBoard = getChessBoard();
    const myColor = localStorage.getItem('myColor');
    const roomID = localStorage.getItem('roomID');

    const dragEndCallback =evt => {
        let from = evt.active.id;
        let to = evt.over.id;
        if(from !== to) {
            handleDrop({from,to}, callbacks.pieceDropCallback, () => {
                socket.emit(GAME_END, roomID);
            });
            return;
        }
        if(from === to) {
            console.log("handleDrop",from,to);
            let moveData = from === to ? {from:selected,to} : {from,to};
            handleDrop(moveData, callbacks.pieceDropCallback, () => {
                socket.emit(GAME_END, roomID);
            });
        } else {
            console.log("handleDrop",from,to,"2");
            let pieceColor = getPieceColor(to);
            pieceColor && selectPiece({square:to,color:pieceColor});
        }
    }

    if (myColor === 'w') {
        return (
            <DndContext onDragEnd={dragEndCallback}>
                <Flex h='80vh' sx={{ userSelect: 'none' }}>
                    <div>
                        {chessBoard.map((row, rowIndex) => {
                            return (
                                <Flex key={rowIndex * 2}>
                                    {row.map(cell => <Cell callbacks={{ pieceClickCallback: callbacks.pieceClickCallback }} key={cell.square} cell={cell} />)}
                                </Flex>
                            )
                        })}
                    </div>
                </Flex>
            </DndContext>
        )
    } else {
        return (
            <DndContext onDragEnd={dragEndCallback}>
                <Flex h='80vh' sx={{userSelect:'none'}}>
                    <div>
                        {chessBoard.map((row, rowIndex) => {
                            return (
                                <Flex key={rowIndex * 2}>
                                    {row.map(cell => <Cell callbacks={{ pieceClickCallback: callbacks.pieceClickCallback }} key={cell.square} cell={cell} />).reverse()}
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