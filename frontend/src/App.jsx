import { createBrowserRouter, redirect, RouterProvider } from 'react-router-dom'

import MainLayout from './layout/MainLayout'
import Home from './pages/Home'
import Settings from './pages/Settings/Settings'
import Friends from './pages/Settings/Friends'
import Password from './pages/Settings/Password'
import Themes from './pages/Settings/Themes'
import PlayLayout from './pages/Play/Layout'
import PlayFriend from './pages/Play/PlayFriend'
import Play from './pages/Play/Play'
import AuthenticationPage from './pages/Authentication/Authentication'
import ChallengeFriend, { playFriendAction } from './pages/Play/ChallengeFriend'
import Profile, { action as profileAction } from './pages/Settings/Profile'
import { getAuthToken, getUserData } from './utils/auth'
import Computer, { playComputerAction } from './pages/Play/Computer'
import ComputerGame from './pages/Play/ComputerGame'
import MultiplayerGame from './pages/Play/MultiplayerGame'

const router = createBrowserRouter([{
  path: '/',
  element: <MainLayout />,
  loader: () => getUserData() || redirect('/login'),
  children: [
    { index: true, element: <Home /> },
    { path: 'home', element: <Home /> },
    {
      path: 'play', element: <PlayLayout />, children: [
        { index: true, element: <Play /> },
        { path: 'friend/:friend_username', element: <ChallengeFriend />, action: playFriendAction },
        { path: 'friend', element: <PlayFriend /> },
        { path: 'computer', element: <Computer />, action: playComputerAction },
        { path: 'online', element: <div>Online</div> }
      ]
    },
    {
      path: "game/friend/:roomID", element: <MultiplayerGame />
    },
    {
      path: "game/computer", element: <ComputerGame />
    },
    {
      path: 'settings', element: <Settings />, children: [
        { index: true, element: <Profile />, action: profileAction },
        { path: 'profile', element: <Profile />, action: profileAction },
        { path: 'themes', element: <Themes /> },
        { path: 'password', element: <Password /> },
        { path: 'friends', element: <Friends /> },
      ]
    },
  ]
},
{
  path: '/login', element: <AuthenticationPage isLogin={true} />, loader: () => { if (getAuthToken()) return redirect('/home'); else return null; }
}, {
  path: '/signup', element: <AuthenticationPage isLogin={false} />, loader: () => { if (getAuthToken()) return redirect('/signup'); else return null; }
}, {
  path: '/logout', loader: () => { getAuthToken() || redirect('/home') }
}]);

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
