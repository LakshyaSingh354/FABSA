import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    token: string | null;
    isAuthenticated: boolean;
    login: (jwtToken: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

import { ReactNode } from 'react';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();
    const demoToken = process.env.DEMO_JWT_TOKEN;

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Check token in localStorage on app load
            const storedToken = localStorage.getItem('jwtToken');
            console.log(`storedToken: ${storedToken}`);
            if (storedToken && storedToken !== demoToken) {
                setToken(storedToken);
                console.log('Token set');
                setIsAuthenticated(true);
                console.log('isAuthenticated set to true');
            }
        }
    }, []);

    const login = (jwtToken: string) => {
        localStorage.setItem('jwtToken', jwtToken);
        setToken(jwtToken);
        setIsAuthenticated(jwtToken !== demoToken);
    };

    const logout = () => {
        localStorage.removeItem('jwtToken');
        setToken(null);
        setIsAuthenticated(false);
        router.push('/login'); // Redirect to login page
    };

    return (
        <AuthContext.Provider value={{ token, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
