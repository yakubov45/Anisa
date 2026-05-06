"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from './firebase/client';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
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
                    // Fetch additional profile data from Firestore
                    const userDocRef = doc(db, COLLECTIONS.USERS, firebaseUser.uid);
                    const userDoc = await getDoc(userDocRef);

                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setUser({
                            uid: firebaseUser.uid,
                            email: firebaseUser.email,
                            photoURL: firebaseUser.photoURL,
                            ...userData
                        });
                    } else {
                        // Default data if doc doesn't exist yet
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

    // 2. THEME PERSISTENCE
    useEffect(() => {
        const savedTheme = localStorage.getItem('onepc_theme');
        if (savedTheme === 'dark') {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
        } else if (savedTheme === 'light') {
            setIsDarkMode(false);
            document.documentElement.classList.remove('dark');
        }
    }, []);

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
        <UserContext.Provider value={{ user, loading, isDarkMode, toggleDarkMode }}>
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
