"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        // Return default values if context is not available (during SSR)
        return {
            theme: "dark" as Theme,
            toggleTheme: () => { },
            setTheme: () => { }
        };
    }
    return context;
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>("dark");
    const [mounted, setMounted] = useState(false);

    // Initialize theme on mount
    useEffect(() => {
        setMounted(true);

        // Check for saved preference, default to dark
        try {
            const savedTheme = localStorage.getItem("foms-theme") as Theme | null;
            if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
                setThemeState(savedTheme);
                applyTheme(savedTheme);
            } else {
                // Default to dark theme for this Lamborghini-themed site
                setThemeState("dark");
                applyTheme("dark");
            }
        } catch {
            // localStorage not available (SSR)
            setThemeState("dark");
        }
    }, []);

    // Apply theme to document
    const applyTheme = useCallback((newTheme: Theme) => {
        if (typeof document === "undefined") return;

        const root = document.documentElement;

        if (newTheme === "dark") {
            root.classList.add("dark");
            root.classList.remove("light");
            root.style.colorScheme = "dark";
        } else {
            root.classList.remove("dark");
            root.classList.add("light");
            root.style.colorScheme = "light";
        }

        try {
            localStorage.setItem("foms-theme", newTheme);
        } catch {
            // localStorage not available
        }
    }, []);

    // Update theme when it changes
    useEffect(() => {
        if (mounted) {
            applyTheme(theme);
        }
    }, [theme, mounted, applyTheme]);

    const toggleTheme = useCallback(() => {
        const newTheme = theme === "light" ? "dark" : "light";
        setThemeState(newTheme);
    }, [theme]);

    const setTheme = useCallback((newTheme: Theme) => {
        setThemeState(newTheme);
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}
