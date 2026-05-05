"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { translations } from "./translations";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [lang, setLang] = useState("uz");

    useEffect(() => {
        const savedLang = localStorage.getItem("language");
        if (savedLang && translations[savedLang]) {
            setLang(savedLang);
        }
    }, []);

    const handleLangChange = (newLang) => {
        if (translations[newLang]) {
            setLang(newLang);
            localStorage.setItem("language", newLang);
        }
    };

    const t = (key) => {
        if (!translations[lang]) return key;
        return translations[lang][key] || translations["uz"][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ lang, setLang: handleLangChange, t }}>
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
