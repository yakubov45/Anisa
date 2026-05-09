"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { translations } from "./translations";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    // Server va client ikkalasida ham "uz" bilan boshlaymiz
    // Bu hydration mismatch ni oldini oladi
    const [lang, setLang] = useState("uz");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Faqat brauzerda, birinchi render dan keyin tilni o'qiymiz
        const savedLang = localStorage.getItem("language");
        if (savedLang && translations[savedLang]) {
            setLang(savedLang);
        }
        setMounted(true);
    }, []);

    const handleLangChange = (newLang) => {
        if (translations[newLang]) {
            setLang(newLang);
            localStorage.setItem("language", newLang);
        }
    };

    // Mounted bo'lguncha har doim "uz" ishlatamiz (server bilan mos keladi)
    const activeLang = mounted ? lang : "uz";

    const t = (key) => {
        if (!translations[activeLang]) return key;
        return translations[activeLang][key] || translations["uz"][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ lang: activeLang, setLang: handleLangChange, t, mounted }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useTranslation = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useTranslation must be used within a LanguageProvider");
    }
    return context;
};
