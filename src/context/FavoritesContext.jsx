import { createContext, useContext, useState, useEffect } from "react";

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
    // Favorites from localStorage
    const [favorites, setFavorites] = useState(() => {
        const saved = localStorage.getItem("favorites");
        return saved ? JSON.parse(saved) : [];
    });

    // Save to localStorage when favorites change
    useEffect(() => {
        localStorage.setItem("favorites", JSON.stringify(favorites));
    }, [favorites]);

    // Add favorite
    const addFavorite = (word) => {
        setFavorites((prev) => {
            const exists = prev.some((w) => w.eng === word.eng);
            if (exists) return prev;
            return [...prev, word];
        });
    };

    // Remove favorite
    const removeFavorite = (word) => {
        setFavorites((prev) => prev.filter((w) => w.eng !== word.eng));
    };

    // Toggle favorite status
    const toggleFavorite = (word) => {
        setFavorites((prev) => {
            const exists = prev.some((w) => w.eng === word.eng);
            if (exists) {
                return prev.filter((w) => w.eng !== word.eng);
            } else {
                return [...prev, word];
            }
        });
    };

    // Check if word is favorite
    const isFavorite = (word) => {
        return favorites.some((w) => w.eng === word.eng);
    };

    return (
        <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, toggleFavorite, isFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
}

export function useFavorites() {
    return useContext(FavoritesContext);
}
