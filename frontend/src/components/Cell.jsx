import React, { useContext } from 'react'

import PropTypes from 'prop-types';
import { socket } from '../socket';
import { Box, Flex } from '@mantine/core';
import { useDroppable } from '@dnd-kit/core'

import Piece from './Piece';
import { ChessGameContext } from '../context/chess-game-context';

import { SOCKET_EVENTS } from '../constants';
const { CHESS_MOVE, GAME_END } = SOCKET_EVENTS

const Cell = ({ cell, callbacks }) => {
    let roomID = localStorage.getItem('roomID');
    let { square, type } = cell;
    const { getSquareColor, isSquareMarked, handleSquareClick, isLastMoveSquare } = useContext(ChessGameContext)
    const { isOver, setNodeRef } = useDroppable({ id: square });
    let squareColor = getSquareColor(square);
    let historyCell = isLastMoveSquare(square);

    let marked = isSquareMarked(square);
    let borderColor = isOver ? '#77777744' : 'transparent';
    let borderWidth = type ? '3px' : '5px'

    const handleClick = () => {
        handleSquareClick(square, callbacks.pieceClickCallback, () => {
            socket.emit(GAME_END, roomID);
        });
    }

    let content = null;
    if (marked && !type) {
        content = <Mark />
    } else if (type) {
        content = <Piece cell={cell} />
    }

    return (
        <Flex ref={setNodeRef} w='10vh' sx={theme => {
            let color = theme.colors.lime;
            return { backgroundColor: historyCell ? '#c0cc5c' : (squareColor === 'b' ? '#769854' : '#e8edcd'), aspectRatio: '1/1' }
        }} onClick={handleClick} bg={squareColor === 'w' ? "white" : "gray"} >
            {content}
        </Flex>
    )
}

const Mark = () => {
    return (
        <Box w="36%" h="36%" sx={{ backgroundColor: '#77777755', borderRadius: '100%' }} m="auto"></Box>
    )
}

Cell.propTypes = {
    cell: PropTypes.shape({
        square: PropTypes.string.isRequired,
        type: PropTypes.oneOf(['p', 'r', 'n', 'b', 'q', 'k']),
        color: PropTypes.oneOf(['w', 'b'])
    })
}


export default Cell