import React from 'react'
import loaderImage from '../assets/chess_board_loader.png'
import { Loader } from '@mantine/core'

const MainLoader = () => {
    return (
        <div style={{ backgroundColor: '#272321', width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', placeItems: 'center' }}>
            <img draggable='false' src={loaderImage} style={{ width: '300px', height: '300px', marginTop: '180px', display: 'block' }} />
            <Loader variant='bars' />
        </div>
    )
}

export default MainLoader