import React, { useContext, useState } from 'react'
import Piece from './Piece';
import { socket } from '../socket';
import { Box, Flex } from '@mantine/core';
import { useDroppable } from '@dnd-kit/core'
import { ChessGameContext } from '../context/chess-game-context';

const Cell = ({ cell }) => {
    let { square, type, color } = cell;
    const { getSquareColor, isSquareMarked, handleSquareClick } = useContext(ChessGameContext)
    const [isDropped, setIsDropped] = useState(false);
    const { isOver, setNodeRef } = useDroppable({ id: square });
    let squareColor = getSquareColor(square);
    let marked = isSquareMarked(square);

    const handleClick = () => {
        handleSquareClick(square);
    }

    let content = marked ? <Mark /> : <Piece cell={cell} />;

    return (
        <Flex ref={setNodeRef} style={{ aspectRatio: '1/1' }} onClick={handleClick} bg={squareColor === 'w' ? "white" : "gray"} >
            {content}
        </Flex>
    )
}

const Mark = () => {
    return (
        <Box w="33%" h="33%" sx={{ backgroundColor: '#77777777', borderRadius: '100%' }} m="auto"></Box>
    )
}


export default Cell