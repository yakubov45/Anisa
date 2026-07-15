"use client";

import { useState, useEffect } from "react";

export default function ImageWithFallback({ src, alt, className, imgClassName = "object-cover", fallbackSrc = "/images/placeholder.webp", ...props }) {
    const [imgSrc, setImgSrc] = useState(src);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        setImgSrc(src);
        setHasError(false);
    }, [src]);

    const handleError = () => {
        if (!hasError) {
            setHasError(true);
            setImgSrc(fallbackSrc);
        }
    };

    return (
        <div className={`relative overflow-hidden bg-surface-50 dark:bg-white/5 ${className}`}>
            <img
                src={imgSrc || fallbackSrc}
                alt={alt}
                onError={handleError}
                loading={props.priority ? "eager" : "lazy"}
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
                className={`w-full h-full transition-all duration-500 select-none pointer-events-auto ${imgClassName} ${hasError ? 'opacity-50 grayscale' : 'opacity-100'}`}
                {...props}
            />
            {hasError && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="flex flex-col items-center gap-1 opacity-20">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-[8px] font-black uppercase tracking-widest">No_Media</span>
                    </div>
                </div>
            )}
        </div>
    );
}
