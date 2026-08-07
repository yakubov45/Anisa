"use client"

import { useEffect, useState } from "react";
import { getBrands } from "@/features/product/api";
import { motion } from "framer-motion";
import Link from "next/link";
import { useTranslation } from "@/lib/LanguageContext";

const FALLBACK_BRANDS = [
    { name: "ASUS", id: "asus" },
    { name: "MSI", id: "msi" },
    { name: "GIGABYTE", id: "gigabyte" },
    { name: "RAZER", id: "razer" },
    { name: "CORSAIR", id: "corsair" },
    { name: "LOGITECH", id: "logitech" },
    { name: "INTEL", id: "intel" },
    { name: "AMD", id: "amd" }
];

export default function BrandStrip() {
    const [brands, setBrands] = useState([]);
    const { t } = useTranslation();

    useEffect(() => {
        const fetchBrands = async () => {
            const data = await getBrands();
            let merged = [];
            
            if (data && data.length > 0) {
                merged = [...data];
            }
            
            if (merged.length < 8) {
                FALLBACK_BRANDS.forEach(fb => {
                    if (merged.length < 8 && !merged.find(b => b.name.toLowerCase() === fb.name.toLowerCase())) {
                        merged.push(fb);
                    }
                });
            }
            
            setBrands(merged);
        };
        fetchBrands();
    }, []);

    if (brands.length === 0) return null;

    // Blunt/rounded triangle shapes using 6 points
    const polygonUp = "polygon(48% 4%, 52% 4%, 98% 95%, 93% 100%, 7% 100%, 2% 95%)";
    const polygonDown = "polygon(48% 96%, 52% 96%, 98% 5%, 93% 0%, 7% 0%, 2% 5%)";

    const loopBrands = [...brands, ...brands, ...brands, ...brands];

    return (
        <section className="py-8 md:py-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none blur-3xl opacity-50" />
            
            <div className="text-center mb-10 relative z-10">
                <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter text-surface-900 dark:text-white drop-shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                    <span className="text-primary drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">{t('brand_elite')}</span> {t('brand_brands')}
                </h2>
                <p className="text-surface-500 dark:text-white/40 text-[10px] md:text-xs uppercase tracking-widest mt-1.5 font-bold">
                    {t('brand_choose_weapon')}
                </p>
            </div>

            <div className="w-full pb-20 pt-12 relative z-10">
                {/* ─── DESKTOP (Always loop) ─── */}
                <div className="hidden md:flex group/list w-full">
                    <motion.div
                        className="flex min-w-max items-center"
                        animate={{ x: ["0%", "-25%"] }}
                        transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
                    >
                        <BrandItems brands={loopBrands} polygonUp={polygonUp} polygonDown={polygonDown} />
                    </motion.div>
                </div>

                {/* ─── MOBILE (Har doim loop) ─── */}
                <div className="flex md:hidden group/list w-full">
                    <motion.div
                        className="flex min-w-max items-center"
                        animate={{ x: ["0%", "-25%"] }}
                        transition={{ repeat: Infinity, ease: "linear", duration: 35 }}
                    >
                        <BrandItems brands={loopBrands} polygonUp={polygonUp} polygonDown={polygonDown} />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

function BrandItems({ brands, polygonUp, polygonDown }) {
    return (
        <>
            {brands.map((brand, i) => {
                const isUp = i % 2 === 0;
                const polygon = isUp ? polygonUp : polygonDown;

                return (
                    <Link 
                        href={`/products?brand=${brand.name}`} 
                        key={`${brand.id || brand.name}-${i}`}
                        // w-[220px] half is 110. To gap by ~30px, use -80px margin.
                        className={`relative block ${i === 0 ? 'ml-0' : '-ml-[30px] md:-ml-[80px]'}`}
                    >
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{
                                repeat: Infinity,
                                duration: 4,
                                ease: "easeInOut",
                                delay: i * 0.2
                            }}
                            className={`
                                w-[130px] h-[110px] md:w-[220px] md:h-[190px] 
                                bg-white/10 backdrop-blur-md
                                transition-all duration-500 ease-out
                                flex items-center justify-center
                                group-hover/list:opacity-40 hover:!opacity-100 hover:scale-[1.10] hover:z-50
                                relative z-10 cursor-pointer
                                drop-shadow-[0_15px_15px_rgba(0,0,0,0.6)]
                            `}
                            style={{ clipPath: polygon }}
                        >
                            <div
                                className="absolute inset-[1px] md:inset-[2px] bg-[#0c0c0e]/95 hover:bg-primary/10 transition-colors duration-500 flex items-center justify-center"
                                style={{ clipPath: polygon }}
                            >
                                {brand.logo ? (
                                    <img
                                        src={brand.logo}
                                        alt={brand.name}
                                        className={`
                                            w-[55%] h-[55%] object-contain
                                            brightness-0 invert opacity-60 group-hover:opacity-100
                                            transition-all duration-300
                                            ${isUp ? 'mt-4 md:mt-8' : 'mb-4 md:mb-8'}
                                        `}
                                    />
                                ) : (
                                    <span
                                        className={`
                                            text-white/60 font-black tracking-widest uppercase text-[10px] md:text-sm
                                            transition-all duration-300
                                            ${isUp ? 'mt-6 md:mt-10' : 'mb-6 md:mb-10'}
                                        `}
                                    >
                                        {brand.name}
                                    </span>
                                )}
                            </div>
                        </motion.div>
                    </Link>
                );
            })}
        </>
    );
}
