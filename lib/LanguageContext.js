"use client";

import { useUser } from "@/lib/UserContext";
import { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [lang, setLang] = useState("en");

    const translations = {
        en: {
            search: "Search",
            cart: "Cart",
            welcome: "Welcome",
            flash_sales: "Flash Sales",
            categories: "Categories"
        }
    };

    const t = (key) => translations[lang][key] || key;

    return (
        <LanguageContext.Provider value={{ lang, setLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useTranslation = () => useContext(LanguageContext);
