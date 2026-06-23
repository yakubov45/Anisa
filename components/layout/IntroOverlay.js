"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function IntroOverlay() {
    // Start as true — show by default, hide if already seen
    const [visible, setVisible] = useState(true);
    const [exit, setExit] = useState(false);
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        const shown = sessionStorage.getItem("onepc_intro_shown");

        if (shown) {
            // Already seen this session — hide immediately without animation
            setVisible(false);
            setChecked(true);
            return;
        }

        setChecked(true);

        const exitTimer = setTimeout(() => setExit(true), 2200);
        const removeTimer = setTimeout(() => {
            setVisible(false);
            sessionStorage.setItem("onepc_intro_shown", "true");
        }, 3000);

        return () => {
            clearTimeout(exitTimer);
            clearTimeout(removeTimer);
        };
    }, []);

    // Don't render anything until we've checked sessionStorage
    // (prevents flash on returning visitors)
    if (!checked || !visible) return null;

    return (
        <AnimatePresence>
            <motion.div
                key="intro"
                initial={{ opacity: 1 }}
                animate={{ opacity: exit ? 0 : 1 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
                style={{ background: "#02040a" }}
            >
                {/* Grid background */}
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(0,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.15) 1px, transparent 1px)",
                        backgroundSize: "60px 60px",
                    }}
                />

                {/* Radial glow */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.12),transparent_60%)] pointer-events-none" />

                {/* Center content */}
                <div className="relative flex flex-col items-center gap-8">
                    {/* Spinning ring */}
                    <div className="relative w-28 h-28 flex items-center justify-center">
                        <motion.div
                            className="absolute inset-0 rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            style={{
                                border: "2px solid transparent",
                                borderTopColor: "#00ffff",
                                borderRightColor: "rgba(0,255,255,0.2)",
                            }}
                        />
                        <motion.div
                            className="absolute inset-3 rounded-full"
                            animate={{ rotate: -360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            style={{
                                border: "1px solid transparent",
                                borderBottomColor: "#00ffff",
                                borderLeftColor: "rgba(0,255,255,0.15)",
                            }}
                        />
                        {/* Logo center */}
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.6, ease: "backOut" }}
                            className="w-14 h-14 rounded-xl flex items-center justify-center"
                            style={{
                                background: "rgba(0,255,255,0.08)",
                                border: "1px solid rgba(0,255,255,0.3)",
                            }}
                        >
                            <span className="text-cyan-400 font-black text-xl tracking-tighter">1PC</span>
                        </motion.div>
                    </div>

                    {/* Brand name */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="text-center"
                    >
                        <p className="text-white font-black text-3xl tracking-[0.3em] uppercase">OnePC</p>
                        <p style={{ color: "rgba(0,255,255,0.6)" }} className="text-[10px] tracking-[0.5em] font-mono mt-1 uppercase">
                            Initializing System
                        </p>
                    </motion.div>

                    {/* Loading bar */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="w-48 h-[2px] rounded-full overflow-hidden"
                        style={{ background: "rgba(255,255,255,0.05)" }}
                    >
                        <motion.div
                            className="h-full rounded-full"
                            style={{ background: "#00ffff" }}
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ delay: 0.8, duration: 1.5, ease: "easeInOut" }}
                        />
                    </motion.div>
                </div>

                {/* Scanlines overlay */}
                <div
                    className="absolute inset-0 opacity-[0.04] pointer-events-none"
                    style={{
                        backgroundImage: "linear-gradient(transparent 50%, rgba(255,255,255,0.08) 50%)",
                        backgroundSize: "100% 4px",
                    }}
                />
            </motion.div>
        </AnimatePresence>
    );
}