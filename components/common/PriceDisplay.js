"use client"

import useStore from "@/store/useStore"
import { useEffect } from "react"
import { currencyService } from "@/lib/services/currency.service"

export default function PriceDisplay({ price, className = "" }) {
    const { currency, exchangeRate, setExchangeRate } = useStore()

    useEffect(() => {
        // Refresh rate from server occasionally
        const fetchRate = async () => {
            const settings = await currencyService.getSettings()
            if (settings && settings.rate) {
                setExchangeRate(settings.rate)
            }
        }
        fetchRate()
    }, [])

    const formatPrice = (p) => {
        if (currency === 'USD') {
            return `$${p.toLocaleString()}`
        }

        // UZS logic
        const rawUZS = p * exchangeRate
        const remainder = rawUZS % 100000
        let roundedUZS
        
        if (remainder >= 50000) {
            roundedUZS = Math.ceil(rawUZS / 100000) * 100000
        } else {
            roundedUZS = Math.floor(rawUZS / 100000) * 100000
        }

        return `${roundedUZS.toLocaleString()} UZS`
    }

    return (
        <span className={className}>
            {formatPrice(price)}
        </span>
    )
}
