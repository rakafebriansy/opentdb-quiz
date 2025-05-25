import React, { createContext, useContext, useEffect, useState } from 'react';
import type { UserModel } from '../models/user.model';
import { EMAIL } from '../constants';

interface AuthContextType {
    user: UserModel | null;
    setUser: React.Dispatch<React.SetStateAction<UserModel | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<UserModel | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const user: UserModel = JSON.parse(storedUser) as UserModel;
                if(user.email != EMAIL) {
                    throw new Error('Unauthorized');
                }
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error('Error while parsing user:', e);
            }
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used inside AuthProvider');
    }
    return context;
};
