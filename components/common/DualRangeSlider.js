"use client";

import { useEffect, useRef, useState } from "react";

export default function DualRangeSlider({ min, max, minLimit, maxLimit, onChange }) {
    const minValRef = useRef(null);
    const maxValRef = useRef(null);
    const rangeRef = useRef(null);

    // Convert to percentage
    const getPercent = (value) => Math.round(((value - minLimit) / (maxLimit - minLimit)) * 100);

    // Set width of the range to decrease from the left side
    useEffect(() => {
        if (maxValRef.current) {
            const minPercent = getPercent(min);
            const maxPercent = getPercent(maxValRef.current.value);

            if (rangeRef.current) {
                rangeRef.current.style.left = `${minPercent}%`;
                rangeRef.current.style.width = `${maxPercent - minPercent}%`;
            }
        }
    }, [min, minLimit, maxLimit]);

    // Set width of the range to decrease from the right side
    useEffect(() => {
        if (minValRef.current) {
            const minPercent = getPercent(minValRef.current.value);
            const maxPercent = getPercent(max);

            if (rangeRef.current) {
                rangeRef.current.style.width = `${maxPercent - minPercent}%`;
            }
        }
    }, [max, minLimit, maxLimit]);

    return (
        <div className="relative w-full h-6 flex items-center">
            <input
                type="range"
                min={minLimit}
                max={maxLimit}
                value={min}
                ref={minValRef}
                onChange={(event) => {
                    const value = Math.min(Number(event.target.value), max - 1);
                    onChange({ min: value, max });
                }}
                className="absolute w-full h-1 pointer-events-none appearance-none bg-transparent z-[3] accent-primary"
                style={{ WebkitAppearance: 'none' }}
            />
            <input
                type="range"
                min={minLimit}
                max={maxLimit}
                value={max}
                ref={maxValRef}
                onChange={(event) => {
                    const value = Math.max(Number(event.target.value), min + 1);
                    onChange({ min, max: value });
                }}
                className="absolute w-full h-1 pointer-events-none appearance-none bg-transparent z-[4] accent-primary"
                style={{ WebkitAppearance: 'none' }}
            />

            <div className="relative w-full h-1 bg-surface-200 dark:bg-white/10 rounded-full">
                <div
                    ref={rangeRef}
                    className="absolute h-full bg-primary rounded-full z-[2]"
                />
            </div>

            <style jsx>{`
                input[type='range']::-webkit-slider-thumb {
                    appearance: none;
                    background-color: #E31E24;
                    border: 3px solid #FFFFFF;
                    border-radius: 50%;
                    cursor: pointer;
                    height: 18px;
                    width: 18px;
                    pointer-events: auto;
                    box-shadow: 0 4px 10px rgba(227, 30, 36, 0.4);
                    transition: transform 0.2s ease;
                }
                input[type='range']::-webkit-slider-thumb:hover {
                    transform: scale(1.1);
                }
                input[type='range']::-webkit-slider-thumb:active {
                    transform: scale(0.9);
                }
                
                /* Firefox support */
                input[type='range']::-moz-range-thumb {
                    background-color: #E31E24;
                    border: 3px solid #FFFFFF;
                    border-radius: 50%;
                    cursor: pointer;
                    height: 18px;
                    width: 18px;
                    pointer-events: auto;
                    box-shadow: 0 4px 10px rgba(227, 30, 36, 0.4);
                }
            `}</style>
        </div>
    );
}
