import React, { useContext } from 'react'
import { ChessGameContext } from '../context/chess-game-context'
import { Button, Flex, Text } from '@mantine/core';

const GameHistory = () => {
    const { gameHistory, jumpTo } = useContext(ChessGameContext)

    let gameHistoryJSX = [];
    for (let i = 0; i < gameHistory.length;) {
        let move1 = null, move2 = null;
        let index = i;
        move1 = <Button onClick={() => { jumpTo(index) }}>{gameHistory[i++].move}</Button>
        if (i < gameHistory.length) {
            let index = i;
            move2 = <Button onClick={() => { jumpTo(index) }}>{gameHistory[i++].move}</Button>
        }
        gameHistoryJSX.push(
            <Flex key={i} direction='row' gap='md'>
                {move1}
                {move2}
            </Flex>
        )
    }

    return (
        <div>
            {gameHistoryJSX}
        </div>
    )
}

export default GameHistory