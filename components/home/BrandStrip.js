"use client"

import { useEffect, useState } from "react";
import { getBrands } from "@/features/product/api";

export default function BrandStrip() {
    const [brands, setBrands] = useState([]);

    useEffect(() => {
        const fetchBrands = async () => {
            const data = await getBrands();
            setBrands(data);
        };
        fetchBrands();
    }, []);

    return (
        <section className="py-16 border-y border-border-alpha">
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-40 grayscale hover:grayscale-0 transition-all">
                {brands.map((brand) => (
                    <div key={brand.id || brand.name} className="h-8 md:h-12 w-32 relative flex items-center justify-center group">
                        {brand.logo ? (
                            <img 
                                src={brand.logo} 
                                alt={brand.name} 
                                className="max-h-full max-w-full object-contain filter brightness-0 dark:invert transition-all group-hover:brightness-100 dark:group-hover:invert-0" 
                            />
                        ) : (
                            <span className="text-xl font-black tracking-widest text-foreground">{brand.name}</span>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}
