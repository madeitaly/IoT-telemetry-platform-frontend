import React, { createContext, useState, useContext } from "react";

// Define what a User looks like for TypeScript
interface UserProfile {
  id: number;
  email: string;
}

interface AuthContextType {
  token: string | null;
  user: UserProfile | null;
  login: (token: string, user: UserProfile) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);


export const AuthProvider = ({children} : {children: React.ReactNode}) => {

    // Initialize from localStorage so data persists on refresh
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

    const [user, setUser] = useState<UserProfile | null>( JSON.parse(localStorage.getItem('user') || 'null'));

    const login = (newToken: string, newUser: UserProfile) => {
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser)); // Objects must be stringified
        setToken(newToken);
        setUser(newUser);
    }

    const logout = () => {
        localStorage.clear();
        setToken(null);
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ token, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};