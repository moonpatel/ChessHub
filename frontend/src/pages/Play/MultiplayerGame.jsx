import React from 'react'
import ChessGameContextProvider from '../../context/chess-game-context'
import ChessGameMultiplayer from './ChessGameMultiplayer'

const MultiplayerGame = () => {


    return (
        <div>
            <ChessGameContextProvider>
                <ChessGameMultiplayer />
            </ChessGameContextProvider>
        </div>
    )
}

export default MultiplayerGame