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
import AuthenticationPage, { loginAction, signupAction } from './pages/Authentication/Authentication'
import ChallengeFriend, { playFriendAction } from './pages/Play/ChallengeFriend'
import ChessGame from './pages/Chess/ChessGame'
import Profile, { action as profileAction } from './pages/Settings/Profile'
import ChessGameContextProvider from './context/chess-game-context'
import { getAuthToken, getUserData } from './utils/auth'

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
        { path: 'computer', element: <div>Computer</div> },
        { path: 'online', element: <div>Online</div> }
      ]
    },
    {
      path: "game/friend/:roomID", element:
        <div>
          <ChessGameContextProvider>
            <ChessGame />
          </ChessGameContextProvider>
        </div>
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
  path: '/login', element: <AuthenticationPage isLogin={true} />, action: loginAction, loader: () => { if (getAuthToken()) return redirect('/home'); else return null; }
}, {
  path: '/signup', element: <AuthenticationPage isLogin={false} />, action: signupAction, loader: () => { if (getAuthToken()) return redirect('/signup'); else return null; }
}, {
  path: '/logout', loader: () => { getAuthToken() || redirect('/home') }
}]);

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
