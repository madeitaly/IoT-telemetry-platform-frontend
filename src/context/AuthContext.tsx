import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({children} : {children: React.ReactNode}) => {

    const [user, setUser] = useState(localStorage.getItem("token"));

    const login = (token : string) => {
        localStorage.setItem("token", token);
        setUser(token);
    }

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);