import React, { createContext, useEffect, useState } from 'react'

import PropTypes from 'prop-types';

export const UserDataContext = createContext();

const UserDataContextProvider = ({ children }) => {
    // TODO: use more secure mechanism insted of localstorage
    const [isLoggedIn, setIsLoggedIn] = useState(JSON.parse(localStorage.getItem('loggedIn')));
    const [user, setUser] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    async function fetchUserDetails() {
        try {
            if (isLoggedIn) {
                let userDetailsUrl = `${import.meta.env.VITE_BACKEND_HOST}/api/user`
                const response = await fetch(userDetailsUrl, {
                    credentials: 'include'
                });
                const resData = await response.json();
                if (response.ok) {
                    setUser(resData);
                } else {
                    setErrorMessage(resData.message);
                }
            }
        } catch (err) {
            setErrorMessage("Something went wrong");
        }
    }

    useEffect(() => {
        fetchUserDetails()
    }, []);

    return (
        <UserDataContext.Provider value={{ user, friends: user?.friends, games: user?.games, errorMessage, isLoggedIn, setIsLoggedIn }}>
            {children}
        </UserDataContext.Provider>
    )
}

UserDataContextProvider.propTypes = {
    children: PropTypes.object
}


export default UserDataContextProvider