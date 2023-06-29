import { Image } from '@mantine/core';
import React, { useEffect } from 'react';
import { useDraggable } from '@dnd-kit/core'

const Piece = ({ piece, row, col, dispatch }) => {
    if (piece === null) return null;
    const { type, color } = piece;
    let logo;
    switch (type) {
        case 'P':
            logo = color === 'W' ? 'pawn_white' : 'pawn_black';
            break;
        case 'R':
            logo = color === 'W' ? 'rook_white' : 'rook_black';
            break;
        case 'N':
            logo = color === 'W' ? 'knight_white' : 'knight_black';
            break;
        case 'B':
            logo = color === 'W' ? 'bishop_white' : 'bishop_black';
            break;
        case 'Q':
            logo = color === 'W' ? 'queen_white' : 'queen_black';
            break;
        case 'K':
            logo = color === 'W' ? 'king_white' : 'king_black';
            break;
    }

    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: row + '-' + col, data: {
            ...piece, row, col
        }
    });
    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        cursor: isDragging ? 'grabbing' : 'pointer',
        zIndex: isDragging ? 100 : 20
    } : undefined;
    useEffect(() => {
        if (isDragging) {
            dispatch({ type: 'SELECT_PIECE', val: { row, col, color } });
        }
    }, [isDragging])

    return (
        <Image ref={setNodeRef} style={style} sx={{ cursor: 'pointer' }} {...listeners} {...attributes} src={`/src/assets/${logo}.png`} />
    )
}

export default Piece