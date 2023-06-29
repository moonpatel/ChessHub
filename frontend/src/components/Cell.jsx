import React, { useState } from 'react'
import Piece from './Piece';
import { socket } from '../socket';
import { Box, Flex } from '@mantine/core';
import { useDroppable } from '@dnd-kit/core'

const Cell = ({ cellProps, selectedPiece, dispatch, myColor }) => {
    const { row, col, piece, marked } = cellProps;
    const { isOver, setNodeRef } = useDroppable({ id: row + "-" + col });
    const [isDropped, setIsDropped] = useState(false);

    let bgColor = (selectedPiece?.row === row && selectedPiece?.col === col) ? 'bg-gray-100' : ((row + col) % 2 ? 'bg-stone-800' : 'bg-neutral-200');
    bgColor = marked && piece ? `bg-red-300` : bgColor;

    const handleClick = () => {
        // if (!myTurn) return;
        if (piece && piece.color === myColor) {
            dispatch({ type: 'SELECT_PIECE', val: { row, col, color: piece.color } })   // select piece
        }
        else if (!piece && selectedPiece && marked) {
            let payload = { fromRow: selectedPiece.row, fromCol: selectedPiece.col, toRow: row, toCol: col };
            socket.emit('move', payload);
            dispatch({ type: 'MOVE_PIECE', val: payload, }); // move piece
        }
        else if (piece && marked && piece.color !== myColor) {
            let payload = { fromRow: selectedPiece.row, fromCol: selectedPiece.col, toRow: row, toCol: col, color: piece.color };
            socket.emit('move', payload);
            dispatch({ type: 'CAPTURE_PIECE', val: payload })  // capture piece
        }
    }

    const content = marked ? <Mark /> : <Piece piece={piece} row={row} col={col} dispatch={dispatch} />;

    return (
        <Flex ref={setNodeRef} onClick={handleClick} w="75px" h="75px" bg={(row + col) % 2 ? 'gray' : 'white'} className={`w-12 h-12 md:w-20 md:h-20 ${bgColor} flex justify-center items-center relative`}>
            {content}
        </Flex>
    )
}

export const Mark = () => {
    return (
        <Box w="33%" h="33%" sx={{ backgroundColor: 'gray', borderRadius: '100%' }} m="auto"></Box>
    )
}


export default Cell