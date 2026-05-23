"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
    Float,
    Text,
    Environment,
    Sparkles
} from "@react-three/drei";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

function RotatingCore() {
    const meshRef = useRef(null);

    useFrame((state, delta) => {
        if (!meshRef.current) return;

        meshRef.current.rotation.y += delta * 0.7;
        meshRef.current.rotation.x += delta * 0.3;
    });

    return (
        <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
            <mesh ref={meshRef}>
                <octahedronGeometry args={[1.4, 0]} />
                <meshStandardMaterial
                    color="#00ffff"
                    emissive="#00ffff"
                    emissiveIntensity={3}
                    metalness={1}
                    roughness={0.1}
                />
            </mesh>
        </Float>
    );
}

function NeonFloor() {
    return (
        <gridHelper
            args={[50, 50, "#00ffff", "#001a1a"]}
            rotation={[0, 0, 0]}
            position={[0, -2, 0]}
        />
    );
}

function FlyingParticles() {
    return (
        <Sparkles
            count={250}
            speed={0.6}
            opacity={1}
            scale={20}
            size={2}
            color="#00ffff"
        />
    );
}

function Scene() {
    const cameraRef = useRef(null);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();

        if (cameraRef.current) {
            cameraRef.current.position.z =
                8 + Math.sin(time * 0.5) * 1;

            cameraRef.current.position.x =
                Math.sin(time * 0.3) * 2;

            cameraRef.current.lookAt(0, 0, 0);
        }
    });

    return (
        <>
            <perspectiveCamera
                ref={cameraRef}
                makeDefault
                position={[0, 0, 8]}
            />

            <color attach="background" args={["#02040a"]} />

            <fog attach="fog" args={["#02040a", 8, 25]} />

            <ambientLight intensity={0.3} />

            <pointLight
                position={[0, 4, 4]}
                intensity={20}
                color="#00ffff"
            />

            <pointLight
                position={[0, -4, -4]}
                intensity={10}
                color="#0066ff"
            />

            <Environment preset="night" />

            <NeonFloor />

            <FlyingParticles />

            <RotatingCore />

            <Text
                position={[0, -3.5, 0]}
                fontSize={0.7}
                color="#ffffff"
                anchorX="center"
                anchorY="middle"
            >
                ONEPC
            </Text>
        </>
    );
}

export default function IntroOverlay() {
    const [visible, setVisible] = useState(true);
    const [exit, setExit] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const shown = sessionStorage.getItem("onepc_intro_shown");

        if (shown) {
            setVisible(false);
            return;
        }

        const exitTimer = setTimeout(() => {
            setExit(true);
        }, 4000);

        const removeTimer = setTimeout(() => {
            setVisible(false);
            sessionStorage.setItem("onepc_intro_shown", "true");
        }, 5200);

        return () => {
            clearTimeout(exitTimer);
            clearTimeout(removeTimer);
        };
    }, []);

    if (!isMounted || !visible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 1 }}
                animate={{
                    opacity: exit ? 0 : 1,
                    scale: exit ? 1.3 : 1,
                    filter: exit
                        ? "blur(20px)"
                        : "blur(0px)"
                }}
                transition={{
                    duration: 1.4,
                    ease: [0.16, 1, 0.3, 1]
                }}
                className="fixed inset-0 z-[9999]"
            >
                <Canvas>
                    <Scene />
                </Canvas>

                {/* overlay glow */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.12),transparent_60%)] pointer-events-none" />

                {/* scanlines */}
                <div
                    className="absolute inset-0 opacity-[0.05] pointer-events-none"
                    style={{
                        backgroundImage:
                            "linear-gradient(transparent 50%, rgba(255,255,255,0.08) 50%)",
                        backgroundSize: "100% 4px"
                    }}
                />

                {/* bottom text */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="absolute bottom-16 left-1/2 -translate-x-1/2 pointer-events-none"
                >
                    <p className="text-cyan-300 text-xs tracking-[0.4em] font-mono">
                        INITIALIZING SYSTEM
                    </p>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}