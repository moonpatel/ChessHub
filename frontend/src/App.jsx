import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button } from '@mantine/core'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home'
import MainLayout from './layout/MainLayout'
import Settings from './pages/Settings/Settings'
import Profile from './pages/Settings/Profile'
import Friends from './pages/Settings/Friends'
import Password from './pages/Settings/Password'
import Themes from './pages/Settings/Themes'
import PlayLayout from './pages/Play/Layout'
import PlayFriend from './pages/Play/PlayFriend'
import Play from './pages/Play/Play'



const router = createBrowserRouter([{
  path: '/',
  element: <MainLayout />,
  children: [
    { index: true, element: <Home /> },
    { path: 'home', element: <Home /> },
    {
      path: 'play', element: <PlayLayout />, children: [
        { index: true, element: <Play /> },
        { path: 'friend', element: <PlayFriend /> },
        { path: 'computer', element: <div>Computer</div> },
        { path: 'online', element: <div>Online</div> }
      ]
    },
    {
      path: 'settings', element: <Settings />, children: [
        { index: true, element: <Profile /> },
        { path: 'profile', element: <Profile /> },
        { path: 'themes', element: <Themes /> },
        { path: 'password', element: <Password /> },
        { path: 'friends', element: <Friends /> },
      ]
    }
  ]
}]);

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
