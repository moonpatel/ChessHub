import React from 'react'
import ChessGameContextProvider from '../../context/chess-game-context'
import ChessGameComputer from './ChessGameComputer'

const ComputerGame = () => {


    return (
        <div>
            <ChessGameContextProvider>
                <ChessGameComputer />
            </ChessGameContextProvider>
        </div>
    )
}

export default ComputerGame