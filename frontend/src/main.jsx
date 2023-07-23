import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { MantineProvider } from '@mantine/styles'
import UserDataContextProvider from './context/user-data-context.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
    <MantineProvider theme={{ colorScheme: 'dark', fontFamily: 'monospace', primaryColor: 'lime' }}>
        <UserDataContextProvider>
            <App />
        </UserDataContextProvider>
    </MantineProvider>
)