import React, { useContext, useState } from 'react'
import Piece from './Piece';
import { socket } from '../socket';
import { Box, Flex, Modal } from '@mantine/core';
import { useDroppable } from '@dnd-kit/core'
import { ChessGameContext } from '../context/chess-game-context';
import { SOCKET_EVENTS } from '../constants';
const { CHESS_MOVE } = SOCKET_EVENTS

const Cell = ({ cell }) => {
    let roomID = localStorage.getItem('roomID');
    let { square, type, color } = cell;
    const { getSquareColor, isSquareMarked, handleSquareClick } = useContext(ChessGameContext)
    const { isOver, setNodeRef } = useDroppable({ id: square });
    let squareColor = getSquareColor(square);
    let marked = isSquareMarked(square);
    let borderColor = isOver ? '#77777777' : 'transparent';
    let borderWidth = type ? '3px':'5px'

    const handleClick = () => {
        handleSquareClick(square, (moveData) => {
            // moveData contains fen string, from, to squares of the move
            socket.emit(CHESS_MOVE, roomID, moveData);
        });
    }

    let content = marked && !type ? <Mark /> : <Piece cell={cell} />;

    return (
        <Flex ref={setNodeRef} style={{ aspectRatio: '1/1', position: 'relative' }} onClick={handleClick} bg={squareColor === 'w' ? "white" : "gray"} >
            {
                isOver ?
                    <div style={{ width: '100%', height: '100%', position: 'absolute', borderWidth, boxSizing: 'border-box', borderStyle: 'solid', borderColor }}></div>
                    : null
            }
            {content}
        </Flex>
    )
}

const Mark = () => {
    return (
        <Box w="36%" h="36%" sx={{ backgroundColor: '#77777755', borderRadius: '100%' }} m="auto"></Box>
    )
}


export default Cell