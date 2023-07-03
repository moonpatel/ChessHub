import { Image } from '@mantine/core';
import React, { useEffect } from 'react';
import { useDraggable } from '@dnd-kit/core'

const Piece = ({ cell, dispatch }) => {
    let { square, type, color } = cell;
    let logo = null;
    switch (type) {
        case 'p':
            logo = color === 'w' ? 'pawn_white' : 'pawn_black';
            break;
        case 'r':
            logo = color === 'w' ? 'rook_white' : 'rook_black';
            break;
        case 'n':
            logo = color === 'w' ? 'knight_white' : 'knight_black';
            break;
        case 'b':
            logo = color === 'w' ? 'bishop_white' : 'bishop_black';
            break;
        case 'q':
            logo = color === 'w' ? 'queen_white' : 'queen_black';
            break;
        case 'k':
            logo = color === 'w' ? 'king_white' : 'king_black';
            break;
    }

    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: square, data: {
            ...cell
        }
    });
    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        cursor: isDragging ? 'grabbing' : 'pointer',
        zIndex: isDragging ? 100 : 20,
        aspectRatio: '1'
    } : undefined;
    useEffect(() => {
        if (isDragging) {
            dispatch({ type: 'SELECT_PIECE', val: cell });
        }
    }, [isDragging])
    if (logo) {
        return (
            <Image ref={setNodeRef} style={style} sx={{ cursor: 'pointer' }} {...listeners} {...attributes} src={`/src/assets/${logo}.png`} />
        )
    } else {
        return (
            <div style={{width:'100%'}}>
            </div>
        )
    }
}

export default Piece