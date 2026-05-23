"use client"

import { useEffect, useState } from "react";
import { getBrands } from "@/features/product/api";
import { motion } from "framer-motion";

export default function BrandStrip() {
    const [brands, setBrands] = useState([]);

    useEffect(() => {
        const fetchBrands = async () => {
            const data = await getBrands();
            // Duplicate the array to create a seamless infinite loop
            if (data && data.length > 0) {
                setBrands([...data, ...data, ...data, ...data]);
            }
        };
        fetchBrands();
    }, []);

    if (brands.length === 0) return null;

    return (
        <section className="py-12 md:py-16 border-y border-white/5 overflow-hidden relative">
            <div className="flex">
                <motion.div 
                    className="flex gap-16 md:gap-24 pr-16 md:pr-24 items-center opacity-60 hover:opacity-100 transition-opacity duration-500"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: 40
                    }}
                >
                    {brands.map((brand, i) => (
                        <div 
                            key={`${brand.id || brand.name}-${i}`} 
                            className="h-8 md:h-12 w-32 relative flex-shrink-0 flex items-center justify-center group cursor-pointer grayscale hover:grayscale-0 transition-all duration-300"
                        >
                            {brand.logo ? (
                                <img 
                                    src={brand.logo} 
                                    alt={brand.name} 
                                    className="max-h-full max-w-full object-contain filter brightness-0 dark:invert transition-all duration-300 group-hover:brightness-100 dark:group-hover:invert-0" 
                                />
                            ) : (
                                <span className="text-xl font-black tracking-widest text-black/60 dark:text-white/60 transition-colors group-hover:text-black dark:group-hover:text-white">{brand.name}</span>
                            )}
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
