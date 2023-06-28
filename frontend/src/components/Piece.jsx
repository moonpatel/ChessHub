import { Image } from '@mantine/core';
import React from 'react';

const Piece = ({ piece }) => {
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
    return (
        <Image src={`/src/assets/${logo}.png`} />
    )
}

export default Piece