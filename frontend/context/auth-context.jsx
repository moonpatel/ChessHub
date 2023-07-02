import { createContext } from "react";

const AuthContext = createContext();

import React from 'react'

const AuthContextProvider = ({ children }) => {
    return (
        <AuthContext.Provider value={{
            
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export default auth - context