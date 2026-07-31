/**
 * AuthContext.jsx — Global authentication state
 *
 * Provides: user, token, login(), logout(), isAuthenticated, isAdmin
 * Token is persisted in localStorage so user stays logged in on refresh.
 *
 * File path: Joblisting-Frontend/src/context/AuthContext.jsx
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser]       = useState(null);   // { id, name, email, roles }
    const [token, setToken]     = useState(null);
    const [loading, setLoading] = useState(true);   // true while restoring session

    // Restore session from localStorage on app start
    useEffect(() => {
        const savedToken = localStorage.getItem('jb_token');
        const savedUser  = localStorage.getItem('jb_user');

        if (savedToken && savedUser) {
            try {
                setToken(savedToken);
                setUser(JSON.parse(savedUser));
            } catch {
                // Corrupted data — clear it
                localStorage.removeItem('jb_token');
                localStorage.removeItem('jb_user');
            }
        }
        setLoading(false);
    }, []);

    const login = useCallback(async (email, password) => {
        const res = await authApi.login({ email, password });
        const data = res.data;

        setToken(data.accessToken);
        setUser({ id: data.id, name: data.name, email: data.email, roles: data.roles });

        localStorage.setItem('jb_token', data.accessToken);
        localStorage.setItem('jb_user', JSON.stringify({
            id: data.id, name: data.name, email: data.email, roles: data.roles
        }));

        return data;
    }, []);

    const register = useCallback(async (name, email, password) => {
        const res = await authApi.register({ name, email, password });
        const data = res.data;

        setToken(data.accessToken);
        setUser({ id: data.id, name: data.name, email: data.email, roles: data.roles });

        localStorage.setItem('jb_token', data.accessToken);
        localStorage.setItem('jb_user', JSON.stringify({
            id: data.id, name: data.name, email: data.email, roles: data.roles
        }));

        return data;
    }, []);

    const logout = useCallback(() => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('jb_token');
        localStorage.removeItem('jb_user');
    }, []);

    const isAuthenticated = Boolean(token && user);
    const isAdmin = isAuthenticated &&
        Array.isArray(user?.roles) && user.roles.includes('ROLE_ADMIN');

    return (
        <AuthContext.Provider value={{
            user,
            token,
            loading,
            login,
            register,
            logout,
            isAuthenticated,
            isAdmin,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
    return ctx;
}