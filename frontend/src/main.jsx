import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { MantineProvider } from '@mantine/styles'

ReactDOM.createRoot(document.getElementById('root')).render(
  <MantineProvider theme={{ colorScheme: 'dark', fontFamily: 'monospace', primaryColor: 'lime' }}>
    <App />
  </MantineProvider>
)