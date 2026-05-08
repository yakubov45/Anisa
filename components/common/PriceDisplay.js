"use client"

import useStore from "@/store/useStore"
import { useEffect } from "react"
import { getCurrencySettingsAction } from "@/lib/actions/currency.actions"

export default function PriceDisplay({ price, className = "" }) {
    const { currency, exchangeRate, setExchangeRate } = useStore()

    useEffect(() => {
        // Refresh rate from server occasionally
        const fetchRate = async () => {
            const settings = await getCurrencySettingsAction()
            if (settings && settings.rate) {
                setExchangeRate(settings.rate)
            }
        }
        fetchRate()
    }, [])

    const formatPrice = (p) => {
        if (currency === 'USD') {
            return (
                <>
                    <span className="opacity-60 text-[0.8em] mr-0.5">$</span>
                    {p.toLocaleString()}
                </>
            )
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
