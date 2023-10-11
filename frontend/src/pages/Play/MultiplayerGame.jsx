import React from 'react'
import ChessGameContextProvider from '../../context/chess-game-context'
import ChessGame from '../Chess/ChessGame'

const MultiplayerGame = () => {


    return (
        <div>
            <ChessGameContextProvider>
                <ChessGame multiplayer={false} />
            </ChessGameContextProvider>
        </div>
    )
}

export default MultiplayerGame