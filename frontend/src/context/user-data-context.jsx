import React, { createContext, useEffect, useState } from 'react'
import { getAuthToken, getUserData } from '../../utils/auth';
export const UserDataContext = createContext();


const UserDataContextProvider = ({ children }) => {
    let { id: userid } = getUserData();
    const [user, setUser] = useState(null);
    const [friends, setFriends] = useState(null)
    const [games, setGames] = useState(null);

    async function fetchUserDetails() {
        let url = `${import.meta.env.VITE_BACKEND_HOST}/api/user/${userid}`;
        let response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`
            }
        });
        let resData = await response.json();
        if (resData.success) {
            let { id, username, email, friends: _friends_, fname, lname, fullName, country, location, games: _games_ } = resData.data;
            setUser({ id, username, email, fname, lname, fullName, country, location })
            setFriends(_friends_)
            setGames(_games_)
            localStorage.setItem('user', JSON.stringify({ id, username, email, fname, lname, fullName, country, location }));
            localStorage.setItem('friends', JSON.stringify(_friends_));
            localStorage.setItem('games', JSON.stringify(_games_));
        } else {
            throw resData.error
        }
    }

    useEffect(() => {
        fetchUserDetails()
    }, []);

    return (
        <UserDataContext.Provider value={{ user, friends, games }}>
            {children}
        </UserDataContext.Provider>
    )
}


export default UserDataContextProvider