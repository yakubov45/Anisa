"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from './firebase/client';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserDataAction } from './actions/user.actions';
import { COLLECTIONS } from './constants';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [loading, setLoading] = useState(true);

    // 1. LISTEN TO AUTH CHANGES
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    // Fetch additional profile data via Server Action
                    const userData = await getUserDataAction(firebaseUser.uid);
                    
                    if (userData) {
                        setUser({
                            uid: firebaseUser.uid,
                            email: firebaseUser.email,
                            emailVerified: firebaseUser.emailVerified,
                            photoURL: firebaseUser.photoURL,
                            ...userData
                        });
                    } else {
                        setUser({
                            uid: firebaseUser.uid,
                            email: firebaseUser.email,
                            photoURL: firebaseUser.photoURL,
                            role: 'user'
                        });
                    }
                } catch (error) {
                    console.error("Auth Listener Error:", error);
                    setUser(null);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // 2. THEME PERSISTENCE — faqat brauzerda, mount dan keyin
    useEffect(() => {
        const savedTheme = localStorage.getItem('onepc_theme');
        if (savedTheme === 'dark') {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
        } else {
            setIsDarkMode(false);
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const refreshUser = async () => {
        if (!auth.currentUser) return;
        try {
            const userData = await getUserDataAction(auth.currentUser.uid);
            if (userData) {
                setUser({
                    uid: auth.currentUser.uid,
                    email: auth.currentUser.email,
                    emailVerified: auth.currentUser.emailVerified,
                    photoURL: auth.currentUser.photoURL,
                    ...userData
                });
            }
        } catch (error) {
            console.error("Refresh User Error:", error);
        }
    };

    const toggleDarkMode = () => {
        setIsDarkMode(isDarkMode => {
            const nextMode = !isDarkMode;
            if (nextMode) {
                document.documentElement.classList.add('dark');
                localStorage.setItem('onepc_theme', 'dark');
            } else {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('onepc_theme', 'light');
            }
            return nextMode;
        });
    };

    return (
        <UserContext.Provider value={{ user, loading, isDarkMode, toggleDarkMode, refreshUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
