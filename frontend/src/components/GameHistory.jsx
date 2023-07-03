import React, { useContext } from 'react'
import { ChessGameContext } from '../context/chess-game-context'
import { Button, Flex, Group, Text } from '@mantine/core';

const GameHistory = () => {
    const { gameHistory, jumpTo, currentIndex,goBack,goAhead } = useContext(ChessGameContext)

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
    console.log(currentIndex)
    return (
        <div>
            {gameHistoryJSX}
            <Group>
                <Button onClick={() => {goBack()}} disabled={currentIndex <= 0 ? true : false}>Go Back</Button>
                <Button onClick={() => {goAhead()}} disabled={currentIndex + 1 === gameHistory.length ? true : false}>Next</Button>
            </Group>
        </div>
    )
}

export default GameHistory