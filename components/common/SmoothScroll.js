"use client";

import { useEffect, useRef } from "react";

export default function SmoothScrollProvider({ children }) {
    const scrollState = useRef({
        targetY: 0,
        currentY: 0,
        isScrolling: false
    });

    useEffect(() => {
        if (typeof window === "undefined") return;

        // Sync initial state
        scrollState.current.targetY = window.scrollY;
        scrollState.current.currentY = window.scrollY;

        // Only run on desktop/devices with wheel events
        const isMobile = () => window.innerWidth < 1024;
        if (isMobile()) return;

        const state = scrollState.current;
        const ease = 0.08; // Lower value = smoother/slower scroll

        const handleWheel = (e) => {
            // Only smooth wheel events, ignore standard page scrolls (e.g. keypress)
            if (isMobile()) return;

            // Don't intercept scroll if scrolling inside a nested scrollable container
            if (e.target.closest('.overflow-y-auto, .overflow-auto, .overflow-x-auto, .scrollable, .no-scrollbar')) {
                state.targetY = window.scrollY;
                state.currentY = window.scrollY;
                return;
            }

            e.preventDefault();

            let delta = e.deltaY;
            if (e.deltaMode === 1) { // DOM_DELTA_LINE
                delta *= 40;
            } else if (e.deltaMode === 2) { // DOM_DELTA_PAGE
                delta *= window.innerHeight;
            }

            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            state.targetY += delta * 0.75;
            state.targetY = Math.max(0, Math.min(state.targetY, maxScroll));

            if (!state.isScrolling) {
                state.isScrolling = true;
                requestAnimationFrame(updateScroll);
            }
        };

        const updateScroll = () => {
            if (!state.isScrolling) return;

            // Linear Interpolation (lerp)
            state.currentY += (state.targetY - state.currentY) * ease;
            window.scrollTo(0, state.currentY);

            if (Math.abs(state.targetY - state.currentY) > 0.4) {
                requestAnimationFrame(updateScroll);
            } else {
                state.isScrolling = false;
            }
        };

        const handleScrollSync = () => {
            // If scrolled by other means (scrollbar drag, arrow keys, pageup/pagedown)
            if (!state.isScrolling) {
                state.targetY = window.scrollY;
                state.currentY = window.scrollY;
            }
        };

        window.addEventListener("wheel", handleWheel, { passive: false });
        window.addEventListener("scroll", handleScrollSync);

        return () => {
            window.removeEventListener("wheel", handleWheel);
            window.removeEventListener("scroll", handleScrollSync);
        };
    }, []);

    return <>{children}</>;
}
