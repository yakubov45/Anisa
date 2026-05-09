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

    const formatPrice = (p) => {
        if (activeCurrency === 'USD') {
            return (
                <>
                    <span className="opacity-60 text-[0.8em] mr-0.5">$</span>
                    {Number(p).toLocaleString()}
                </>
            )
        }
        const rawUZS = p * activeRate
        const remainder = rawUZS % 100000
        const roundedUZS = remainder >= 50000
            ? Math.ceil(rawUZS / 100000) * 100000
            : Math.floor(rawUZS / 100000) * 100000

        return (
            <>
                {roundedUZS.toLocaleString()}
                <span className="opacity-60 text-[0.5em] ml-1 uppercase">UZS</span>
            </>
        )
    }

    return (
        <span className={className}>
            {formatPrice(price)}
        </span>
    )
}
