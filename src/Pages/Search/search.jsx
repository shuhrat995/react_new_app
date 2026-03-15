// import { useState, useEffect } from "react";
// import { useSettings } from "../../context/SettingsContext";

// export default function Search({ Navbar }) {
//   const [word, setWord] = useState("");
//   const [vocabulary, setVocabulary] = useState([]);

//   useEffect(() => {
//     if (!word) {
//       setVocabulary([]);
//       return;
//     }

//     const letter = word[0].toLowerCase();

//     import(`../../vocabularies/${letter}.js`)
//       .then((module) => {
//         setVocabulary(module.default);
//       })
//       .catch(() => {
//         setVocabulary([]); 
//       });
//   }, [word]);

//   const filtered =
//     word === ""
//       ? []
//       : vocabulary.filter((obj) =>
//           obj.eng.toLowerCase().startsWith(word.toLowerCase()),
//         );

//   return (
//     <div>
//       <input
//         type="text"
//         id="searchInput"
//         value={word}
//         onChange={(e) => setWord(e.target.value)}
//       />
//       {filtered.map((obj, i) => (
//         <div key={i}>
//           <h3>
//             {i + 1} {obj.eng}
//           </h3>
//           <p>
//             <b>{obj.type}</b> | {obj.uzb} | <i>/{obj.tran}/</i>
//           </p>
//         </div>
//       ))}
//       <Navbar />
//     </div>
//   );
// }






import { useState, useEffect } from "react";
import { useSettings } from "../../context/SettingsContext";
import { useFavorites } from "../../context/FavoritesContext";
import "./search.css";

export default function Search() {
  const [word, setWord] = useState("");
  const [vocabulary, setVocabulary] = useState([]);
  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    if (!word) {
      setVocabulary([]);
      return;
    }

    const letter = word[0].toLowerCase();

    import(`../../vocabularies/${letter}.js`)
      .then((module) => {
        setVocabulary(module.default);
      })
      .catch(() => {
        setVocabulary([]);
      });
  }, [word]);

  const filtered =
    word === ""
      ? []
      : vocabulary.filter((obj) =>
          obj.eng.toLowerCase().startsWith(word.toLowerCase()),
        );

  const handleFavoriteClick = (obj, e) => {
    e.stopPropagation();
    toggleFavorite(obj);
  };

  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedNote = localStorage.getItem("quickNote");
    if (savedNote) setNote(savedNote);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem("quickNote", note);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 1000);
    return () => clearTimeout(timer);
  }, [note]);

  return (
    <div className="search-page">
      <input
        type="text"
        id="searchInput"
        value={word}
        onChange={(e) => setWord(e.target.value)}
        placeholder="So'z qidiring..."
      />

      {filtered.map((obj, i) => {
        const favorited = isFavorite(obj);
        return (
          <div key={i} className="search-result-item">
            <div className="search-result-content">
              <h3>
                {obj.eng}
              </h3>
              <p>
                <b>{obj.type}</b> | {obj.uzb} | <i>/{obj.tran}/</i>
              </p>
            </div>
            <button
              className={`favorite-btn ${favorited ? "favorited" : ""}`}
              onClick={(e) => handleFavoriteClick(obj, e)}
              title={favorited ? "Favoritesdan o'chirish" : "Favoritesga qo'shish"}
            >
              {favorited ? "★" : "☆"}
            </button>
          </div>
        );
      })}

      <div className="notes-section">
        <div className="notes-header">
          <h3>📝 Mening Eslatmalarim</h3>
          {saved && <span className="saved-indicator">✓ Saqlandi</span>}
        </div>

        <textarea
          className="notes-textarea"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Muhim fikrlarni shu yerga yozing (avto-saqlanadi)..."
        />
      </div>
    </div>
  );
}