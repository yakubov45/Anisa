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
                            className="h-8 md:h-12 w-auto relative flex-shrink-0 flex items-center justify-center group cursor-pointer transition-all duration-300"
                        >
                            <div className="flex items-center gap-8 md:gap-16">
                                <span className="text-2xl md:text-3xl font-black tracking-[0.2em] text-white/40 transition-colors group-hover:text-primary uppercase whitespace-nowrap drop-shadow-sm font-outfit">
                                    {brand.name}
                                </span>
                                <div className="w-2 h-2 rounded-full bg-primary/30 group-hover:bg-primary transition-colors duration-300" />
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
