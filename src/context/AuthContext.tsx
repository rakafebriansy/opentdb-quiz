import React, { createContext, useContext, useEffect, useState } from 'react';
import type { UserModel } from '../models/user.model';
import { EMAIL } from '../constants';

interface AuthContextType {
    user: UserModel | null;
    setUser: React.Dispatch<React.SetStateAction<UserModel | null>>;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    isResumed: boolean;
    setIsResumed: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<UserModel | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [isResumed, setIsResumed] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const user: UserModel = JSON.parse(storedUser) as UserModel;
                if (user.email != EMAIL) {
                    throw new Error('Unauthorized');
                }
                setUser(JSON.parse(storedUser));
                setIsResumed(true);
            } catch (e) {
                console.error('Error while parsing user:', e);
            }
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading, isResumed, setIsResumed }}>
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
