"use client"

import { useState, useEffect } from "react"
import useStore from "@/store/useStore"

export default function PriceDisplay({ price, className = "" }) {
    const { currency, exchangeRate } = useStore()
    // Hydration mismatch oldini olish — server har doim USD ko'rsatadi
    const [mounted, setMounted] = useState(false)
    useEffect(() => { setMounted(true) }, [])

    const activeCurrency = mounted ? currency : 'USD'
    const activeRate = mounted ? exchangeRate : 12800

    const formatPriceLocal = (p) => {
        const val = Number(p)
        if (isNaN(val)) {
            return activeCurrency === 'UZS' ? <>0 <span className="opacity-60 text-[0.5em] ml-1 uppercase">UZS</span></> : <><span className="opacity-60 text-[0.8em] mr-0.5">$</span>0.00</>;
        }

        const isDbPriceInUZS = val > 100000;

        if (activeCurrency === 'USD') {
            const usdValue = isDbPriceInUZS ? val / activeRate : val;
            const roundedUSD = Math.round(usdValue);
            return (
                <>
                    <span className="opacity-60 text-[0.8em] mr-0.5">$</span>
                    {roundedUSD.toLocaleString('en-US')}
                </>
            )
        } else {
            const uzsValue = isDbPriceInUZS ? val : val * activeRate;
            const roundedUZS = uzsValue >= 100000 
                ? Math.round(uzsValue / 10000) * 10000 
                : Math.round(uzsValue);

            return (
                <>
                    {roundedUZS.toLocaleString('en-US')}
                    <span className="opacity-60 text-[0.5em] ml-1 uppercase">UZS</span>
                </>
            )
        }
    }

    return (
        <span className={className}>
            {formatPriceLocal(price)}
        </span>
    )
}
