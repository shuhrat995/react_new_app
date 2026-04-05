import { createContext, useContext, useState, useEffect } from "react";

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
    // Load from localStorage or default values
    const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
    const [lang, setLang] = useState(() => localStorage.getItem("lang") || "uz");
    const [fontSize, setFontSize] = useState(() => localStorage.getItem("fontSize") || "medium");

    // Theme effect
    useEffect(() => {
        document.body.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    // Font size effect
    useEffect(() => {
        document.documentElement.setAttribute("data-font-size", fontSize);
        document.body.setAttribute("data-font-size", fontSize);
        localStorage.setItem("fontSize", fontSize);
    }, [fontSize]);

    // Language effect
    useEffect(() => {
        document.documentElement.setAttribute("data-lang", lang);
        document.body.setAttribute("data-lang", lang);
        localStorage.setItem("lang", lang);
    }, [lang]);

    return (
        <SettingsContext.Provider value={{ theme, setTheme, lang, setLang, fontSize, setFontSize }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    return useContext(SettingsContext);
}