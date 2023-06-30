import React, { useState } from 'react'
import Piece from './Piece';
import { socket } from '../socket';
import { Box, Flex } from '@mantine/core';
import { useDroppable } from '@dnd-kit/core'

const Cell = ({ cell, chess, marked, dispatch }) => {
    const { square, type, color } = cell;
    const { isOver, setNodeRef } = useDroppable({ id: square });
    const [isDropped, setIsDropped] = useState(false);

    const handleClick = () => {
        if (type && chess.turn() === chess.myColor) {
            return dispatch({ type: 'SELECT_PIECE', val: square });
        }
        console.log(type, chess.selected, marked)
        if (!type && chess.selected && marked) {
            console.log(square)
            dispatch({ type: 'MOVE_PIECE', val: { from: chess.selected, to: square } })
        }
        if (type && marked) {
            dispatch({ type: 'CAPTURE_PIECE', val: { from: chess.selected, to: square } })
        }
    }

    let content;
    content = marked ? <Mark /> : <Piece cell={cell} dispatch={dispatch} />;
    let squareColor = chess.squareColor(square) === "dark" ? "gray" : "white";

    return (
        <Flex ref={setNodeRef} onClick={handleClick} w="75px" h="75px" bg={squareColor} >
            {content}
        </Flex>
    )
}

export const Mark = () => {
    return (
        <Box w="33%" h="33%" sx={{ backgroundColor: '#77777777', borderRadius: '100%' }} m="auto"></Box>
    )
}


export default Cell