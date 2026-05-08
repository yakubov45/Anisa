"use client";

import { useEffect } from "react";
import useStore from "@/store/useStore";
import { getCurrencySettingsAction } from "@/lib/actions/currency.actions";

export default function CurrencyInitializer() {
    const { setExchangeRate } = useStore();

    useEffect(() => {
        const fetchRate = async () => {
            try {
                const settings = await getCurrencySettingsAction();
                if (settings && settings.rate) {
                    setExchangeRate(settings.rate);
                }
            } catch (error) {
                console.error("Failed to initialize currency:", error);
            }
        };
        fetchRate();
    }, [setExchangeRate]);

    return null; // This component doesn't render anything
}
