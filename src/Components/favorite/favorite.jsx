import { useFavorites } from "../../context/FavoritesContext";
import "./favorite.css";

export default function Favorites() {
  const { favorites, toggleFavorite } = useFavorites();

  const handleRemoveFavorite = (word, e) => {
    e.stopPropagation();
    toggleFavorite(word);
  };

  return (
    <div className="favorites-page">
      <h2>⭐ Favorites</h2>
      
      {favorites.length === 0 ? (
        <div className="favorites-empty">
          <p>📭 Hozircha saqlangan so'zlar yo'q</p>
          <p>Qidiruvdan so'zlarni yulduzchaga bosib saqlashingiz mumkin</p>
        </div>
      ) : (
        <div className="favorites-list">
          {favorites.map((obj, i) => (
            <div key={i} className="favorite-item">
              <div className="favorite-content">
                <h3>{obj.eng}</h3>
                <p>
                  <b>{obj.type}</b> | {obj.uzb} | <i>/{obj.tran}/</i>
                </p>
              </div>
              <button
                className="remove-favorite-btn"
                onClick={(e) => handleRemoveFavorite(obj, e)}
                title="Favoritesdan o'chirish"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
