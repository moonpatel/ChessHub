import { Image, createStyles } from '@mantine/core';
import React, { useContext, useEffect } from 'react';
import { useDraggable } from '@dnd-kit/core'
import { ChessGameContext } from '../context/chess-game-context';
import PropTypes from 'prop-types';

const useStyles = createStyles(() => ({
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

    let borderColor = marked ? '#77777744' : 'transparent'

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        cursor: isDragging ? 'grabbing' : 'pointer',
        zIndex: 1000,
        aspectRatio: '1',
        touchAction: 'none',
        borderRadius: '10px',
        outline: 'none'
    } : {
        zIndex: 10
    };

    useEffect(() => {
        if (isDragging) {
            selectPiece(cell);
        }
    }, [isDragging])


    if (logo) {
        return (
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <div style={{ borderRadius: '50%', position: 'absolute', boxSizing: 'border-box', borderWidth: '7px', width: '100%', height: '100%', borderStyle: 'solid', borderColor }}>
                </div>
                <div style={{ width: '100%', height: '100%' }}>
                    <Image classNames={{ root: classes['chess-piece'] }} ref={setNodeRef} style={style} sx={{ cursor: 'pointer' }} {...listeners} {...attributes} src={`/assets/images/${logo}.png`} />
                </div>
            </div>
        )
    } else {
        return (
            <div style={{ width: '100%' }}></div>
        )
    }
}

Piece.propTypes = {
    cell: PropTypes.shape({
        square: PropTypes.string.isRequired,
        type: PropTypes.oneOf(['p', 'r', 'n', 'b', 'q', 'k']),
        color: PropTypes.oneOf(['w', 'b'])
    })
}

export default Piece