import { Image, createStyles } from '@mantine/core';
import React, { useContext, useEffect } from 'react';
import { useDraggable } from '@dnd-kit/core'
import { ChessGameContext } from '../context/chess-game-context';

const useStyles = createStyles((theme) => ({
    'chess-piece': {
        outlineStyle: 'none',
        boxShadow: 'none',
        borderColor: 'transparent'
    }
}));

const Piece = ({ cell }) => {
    const { classes } = useStyles();
    const { selectPiece, isSquareMarked } = useContext(ChessGameContext)
    let { square, type, color } = cell;
    let marked = isSquareMarked(square);
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

    let borderColor = marked ? '#77777766' : 'transparent'


    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        cursor: isDragging ? 'grabbing' : 'pointer',
        zIndex: isDragging ? 1000 : 10,
        aspectRatio: '1',
        touchAction: 'none',
        borderRadius: '10px',
        outline: 'none'
    } : undefined;

    useEffect(() => {
        if (isDragging) {
            selectPiece(cell);
        }
    }, [isDragging])


    if (logo) {
        return (
            <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', borderRadius: '50%', boxSizing: 'border-box', borderWidth: '8px', width: '100%', height: '100%', borderStyle: 'solid', borderColor }}>
                </div>
                <Image classNames={{ root: classes['chess-piece'] }} ref={setNodeRef} style={style} sx={{ cursor: 'pointer' }} {...listeners} {...attributes} src={`/src/assets/images/${logo}.png`} />
            </div>
        )
    } else {
        return (
            <div style={{ width: '100%', zIndex: 100 }}></div>
        )
    }
}

export default Piece