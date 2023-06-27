import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button } from '@mantine/core'
import { createBrowserRouter, redirect, RouterProvider } from 'react-router-dom'
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
import AuthenticationPage, { loginAction, signupAction } from './pages/Authentication/Authentication'
import { getAuthToken } from '../utils/auth'
import { logoutAction } from './components/Logout'



const router = createBrowserRouter([{
  path: '/',
  element: <MainLayout />,
  loader: () => getAuthToken() || redirect('/login'),
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
    },
  ]
}, {
  path: '/login', element: <AuthenticationPage isLogin={true} />, action: loginAction, loader: () => { if (getAuthToken()) return redirect('/home'); else return null; }
}, {
  path: '/signup', element: <AuthenticationPage isLogin={false} />, action: signupAction, loader: () => { if (getAuthToken()) return redirect('/signup'); else return null; }
}, {
  path: '/logout', loader: () => { getAuthToken() || redirect('/home') }, action: logoutAction
}]);

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
