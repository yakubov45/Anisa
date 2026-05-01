"use client"

import { useState, useEffect } from "react";

export function useRecentlyViewed() {
    const [recent, setRecent] = useState([]);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("onepc_recent")) || [];
        setRecent(stored);
    }, []);

    const addRecentlyViewed = (product) => {
        const stored = JSON.parse(localStorage.getItem("onepc_recent")) || [];
        const filtered = stored.filter(p => p.id !== product.id);
        const updated = [product, ...filtered].slice(0, 10);
        localStorage.setItem("onepc_recent", JSON.stringify(updated));
        setRecent(updated);
    };

    return { recent, addRecentlyViewed };
}
