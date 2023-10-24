import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { socket } from '../socket';
import { Box, Flex } from '@mantine/core';
import { useDroppable } from '@dnd-kit/core';
import Piece from './Piece';
import { ChessGameContext } from '../context/chess-game-context';
import { SOCKET_EVENTS } from '../constants';

const { CHESS_MOVE, GAME_END } = SOCKET_EVENTS;

const Cell = ({ cell, callbacks, rowLabel, columnLabel }) => {
    let roomID = localStorage.getItem('roomID');
    let { square, type } = cell;
    const { getSquareColor, isSquareMarked, handleSquareClick } = useContext(ChessGameContext);
    const { isOver, setNodeRef } = useDroppable({ id: square });
    let squareColor = getSquareColor(square);
    let marked = isSquareMarked(square);
    let borderColor = isOver ? '#77777744' : 'transparent';
    let borderWidth = type ? '3px' : '5px';

    const handleClick = () => {
        handleSquareClick(square, callbacks.pieceClickCallback, () => {
            socket.emit(GAME_END, roomID);
        });
    }

    let content = null;
    if (marked && !type) {
        content = <Mark />;
    } else if (type) {
        content = <Piece cell={cell} />;
    }

    return (
        <Flex ref={setNodeRef} w='10vh' sx={theme => {
            let color = theme.colors.lime;
            return { backgroundColor: squareColor === 'b' ? '#769854' : '#e8edcd', aspectRatio: '1/1' };
        }} onClick={handleClick} bg={squareColor === 'w' ? "white" : "gray"}>
            {rowLabel && (
                <div style={{ position: 'absolute', left: '5px', top: '50%', transform: 'translateY(-50%)' }}>
                    {rowLabel}
                </div>
            )}
            {columnLabel && (
                <div style={{ position: 'absolute', top: '5px', left: '50%', transform: 'translateX(-50%)' }}>
                    {columnLabel}
                </div>
            )}
            {content}
        </Flex>
    );
};

const Mark = () => {
    return (
        <Box w="36%" h="36%" sx={{ backgroundColor: '#77777755', borderRadius: '100%' }} m="auto"></Box>
    );
};

Cell.propTypes = {
    cell: PropTypes.shape({
        square: PropTypes.string.isRequired,
        type: PropTypes.oneOf(['p', 'r', 'n', 'b', 'q', 'k']),
        color: PropTypes.oneOf(['w', 'b']),
    }),
    rowLabel: PropTypes.string,
    columnLabel: PropTypes.string,
};

export default Cell;
