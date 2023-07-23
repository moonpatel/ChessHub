import React from 'react'
import { createPortal } from 'react-dom'
import loaderImage from '../assets/images/chess_board_loader.png'
import { Loader, Title } from '@mantine/core'

const MainLoader = ({ errorMessage }) => {
    return (
        <>
            {
                createPortal(<div style={{ position: 'absolute', backgroundColor: '#272321', width: '100vw', height: '100vh', top: 0, left: 0, display: 'flex', flexDirection: 'column', placeItems: 'center', zIndex: 1000 }}>
                    <img draggable='false' src={loaderImage} style={{ width: '300px', height: '300px', marginTop: '180px', display: 'block' }} />
                    {
                        errorMessage
                            ?
                            <Title style={{ color: 'red', fontSize: '120%' }}>
                                {errorMessage}
                            </Title>
                            :
                            <Loader variant='bars' />
                    }
                </div>, document.querySelector('#main-loader'))

            }
        </>
        // <div style={{ backgroundColor: '#272321', width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', placeItems: 'center' }}>
        //     <img draggable='false' src={loaderImage} style={{ width: '300px', height: '300px', marginTop: '180px', display: 'block' }} />
        //     <Loader variant='bars' />
        // </div>
    )
}

export default MainLoader