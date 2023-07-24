import React, { useContext } from 'react'
import { ChessGameContext } from '../context/chess-game-context'
import { Button, Flex, ScrollArea, Tooltip, createStyles } from '@mantine/core';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'

const useStyles = createStyles(() => {
    return {
        movebtn: {
            fontSize: '14px',
            padding: '5px',
            backgroundColor: 'transparent',
            width: '63px',
            ':hover': {
                backgroundColor: 'transparent',
            }
        },
        actionbtn: {
            borderRadius: '5px',
            backgroundColor: '#444444',
            ':hover': {
                backgroundColor: '#555555',
            }
        }
    }
})

const GameHistory = () => {
    let { classes } = useStyles();
    const { gameHistory, jumpTo, goBack, goAhead } = useContext(ChessGameContext)

    let gameHistoryJSX = [];
    for (let i = 0; i < gameHistory.length;) {
        let move1 = null, move2 = null;
        let index = i;
        move1 = <Button className={classes.movebtn} onClick={() => { jumpTo(index) }}>{gameHistory[i++].move}</Button>
        if (i < gameHistory.length) {
            let index = i;
            move2 = <Button className={classes.movebtn} onClick={() => { jumpTo(index) }}>{gameHistory[i++].move}</Button>
        }
        let srno = Math.ceil(i / 2);
        gameHistoryJSX.push(
            <Flex key={i} direction='row' align='center' w='100%' my="0px" sx={{ fontSize: '16px', fontFamily: 'monospace', backgroundColor: srno % 2 || '#303030' }} justify='start' gap='xs'>
                <div style={{ width: '36px', paddingLeft: '10px' }}>
                    {Math.ceil(i / 2)}.
                </div>
                {move1}
                {move2}
            </Flex>
        )
    }
    // console.log(currentIndex)
    return (
        <div style={{ width: '100%', userSelect: 'none' }}>
            <ScrollArea h={400} scrollbarSize={6} >
                <Flex direction='column' align='start' w='100%'>
                    {gameHistoryJSX}
                </Flex>
            </ScrollArea>
            <Flex my='sm' justify='center' gap='xs'>
                <Tooltip label="Move Back" withArrow arrowSize={9} arrowRadius={3} transitionProps={{ duration: 200 }} sx={{ backgroundColor: 'black', color: 'white' }}>
                    <Button size='xl' w='130px' h='45px' className={classes.actionbtn} onClick={goBack}>
                        <IconChevronLeft size={40} />
                    </Button>
                </Tooltip>
                <Tooltip label="Move Forward" withArrow arrowSize={9} arrowRadius={3} sx={{ backgroundColor: 'black', color: 'white' }}>
                    <Button size='xl' w='130px' h='45px' className={classes.actionbtn} onClick={goAhead}>
                        <IconChevronRight size={40} />
                    </Button>
                </Tooltip>
            </Flex>
        </div>
    )
}

export default GameHistory