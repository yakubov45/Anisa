"use client"

import useStore from "@/store/useStore"
import useUIStore from "@/store/useUIStore"

export default function BuildBuyButton({ build }) {
    const { addToCart } = useStore()
    const { addToast, triggerCartAnimation } = useUIStore()

    const handleBuy = () => {
        // We map the build object to a format consistent with products
        const productData = {
            id: build.id,
            name: build.name,
            price: build.price,
            image: build.image,
            category: 'Pre-built PC',
            brand: 'OnePC',
            stock: 10, // Default for pre-builts
            ...build
        }
        
        addToCart(productData)
        triggerCartAnimation()
        addToast(`${build.name} SAVATCHAGA QO'SHILDI`)
    }

    return (
        <button 
            onClick={handleBuy}
            className="w-full sm:w-auto bg-foreground text-background font-black text-[11px] uppercase tracking-[0.3em] px-16 py-6 rounded-2xl hover:bg-primary hover:text-white hover:scale-105 active:scale-95 transition-all shadow-premium group flex items-center justify-center gap-4"
        >
            BUY NOW
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7-7 7M3 12h18" />
            </svg>
        </button>
    )
}
