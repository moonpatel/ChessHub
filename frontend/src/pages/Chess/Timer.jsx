import React from 'react'

import { Box } from '@mantine/core';

import useCountDown from '../../hooks/useCountDown'

const Timer = ({ on }) => {
    // const { isTimerOn } = useContext(ChessGameContext)
    const timeLimit = localStorage.getItem('timeLimit');
    const [seconds, minutes] = useCountDown(timeLimit, on);
    return (
        <Box ff='monospace' sx={{ fontSize: '30px' }}>
            {minutes}:{seconds}
        </Box>
    )
}

export default Timer