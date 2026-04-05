import { useState, useEffect, useRef } from "react";
import { useSettings } from "../../context/SettingsContext";
import { useFavorites } from "../../context/FavoritesContext";
import { IoClose } from "react-icons/io5";
import "./search.css";

// Global variables for vocabulary
let allWords = [];
let wordsByLetter = {};
let isLoaded = false;
const VOCAB_LETTERS = 'abcdefghijklmnopqrstuvwxyz'.split('');

// Load all vocabulary files
async function loadAllVocabulary() {
  if (isLoaded) return allWords;

  const promises = VOCAB_LETTERS.map(async (letter) => {
    try {
      const module = await import(`../../vocabularies/${letter}.js`);
      wordsByLetter[letter] = module.default || [];
      return module.default || [];
    } catch (e) {
      wordsByLetter[letter] = [];
      return [];
    }
  });

  const results = await Promise.all(promises);
  allWords = results.flat();
  isLoaded = true;

  console.log(`Loaded ${allWords.length} words`);
  return allWords;
}

// Search function
function searchWord(query, limit = 100) {
  if (!query || query.trim() === "") return [];

  const lowerQuery = query.toLowerCase().trim();
  const firstLetter = lowerQuery[0];
  const words = wordsByLetter[firstLetter] || [];

  const results = [];
  for (let i = 0; i < words.length; i++) {
    const word = words[i].eng.toLowerCase();
    if (word.startsWith(lowerQuery)) {
      results.push(words[i]);
      if (results.length >= limit) break;
    }
  }

  return results;
}

// Group words by English spelling
function groupWords(words) {
  const grouped = {};
  words.forEach(word => {
    const eng = word.eng.toLowerCase();
    if (!grouped[eng]) {
      grouped[eng] = [];
    }
    grouped[eng].push(word);
  });
  return grouped;
}

// Strip HTML tags from string
function stripHtml(html) {
  if (!html) return "";
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

// Main Search component
export default function Search() {
  const [word, setWord] = useState("");
  const [vocabulary, setVocabulary] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toggleFavorite, isFavorite } = useFavorites();
  const debounceRef = useRef(null);
  
  // Modal state
  const [selectedWord, setSelectedWord] = useState(null);
  const [selectedMeaningIndex, setSelectedMeaningIndex] = useState(0);

  // Load vocabulary on mount
  useEffect(() => {
    loadAllVocabulary().then(() => {
      setIsLoading(false);
    });
  }, []);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!word) {
      setVocabulary([]);
      return;
    }

    debounceRef.current = setTimeout(() => {
      const results = searchWord(word, 100);
      setVocabulary(results);
    }, 50);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [word]);

  // Group vocabulary by English word
  const groupedVocab = groupWords(vocabulary);
  const groupedKeys = Object.keys(groupedVocab);

  // Handle favorite button click
  const handleFavoriteClick = (obj, e) => {
    e.stopPropagation();
    toggleFavorite(obj);
  };

  // Open modal with word group
  const handleWordClick = (engWord, meanings) => {
    setSelectedWord({ eng: engWord, meanings });
    setSelectedMeaningIndex(0);
  };

  // Close modal
  const closeModal = () => {
    setSelectedWord(null);
    setSelectedMeaningIndex(0);
  };

  return (
    <div className="search-page">
      <input
        type="text"
        id="searchInput"
        value={word}
        onChange={(e) => setWord(e.target.value)}
        placeholder="So'z qidiring..."
      />

      {isLoading ? (
        <div className="loading-message">Lug'at yuklanmoqda...</div>
      ) : groupedKeys.length === 0 && word ? (
        <div className="no-results">Natija topilmadi</div>
      ) : (
        groupedKeys.map((engWord, i) => {
          const meanings = groupedVocab[engWord];
          const firstMeaning = meanings[0];
          const favorited = isFavorite(firstMeaning);
          const hasMultiple = meanings.length > 1;

          return (
            <div 
              key={i} 
              className={`search-result-item ${hasMultiple ? 'has-multiple' : ''}`}
              onClick={() => hasMultiple ? handleWordClick(engWord, meanings) : null}
            >
              <div className="search-result-content">
                <h3>
                  {firstMeaning.eng}
                  {hasMultiple && <span className="multiple-indicator"> +{meanings.length - 1}</span>}
                </h3>
                <p>
                  {firstMeaning.type && <b>{firstMeaning.type}</b>}
                  {firstMeaning.uzb && <span> | {firstMeaning.uzb}</span>}
                  {firstMeaning.tran && <span> | <i>/{firstMeaning.tran}/</i></span>}
                </p>
              </div>
              <div className="search-result-actions">
                <button
                  className="view-full-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWordClick(engWord, meanings);
                  }}
                  title="To'liq ko'rish"
                >
                  To'liq
                </button>
                <button
                  className={`favorite-btn ${favorited ? "favorited" : ""}`}
                  onClick={(e) => handleFavoriteClick(firstMeaning, e)}
                  title={favorited ? "Favoritesdan o'chirish" : "Favoritesga qo'shish"}
                >
                  {favorited ? "★" : "☆"}
                </button>
              </div>
            </div>
          );
        })
      )}

      {/* Full Detail Modal */}
      {selectedWord && (
        <div className="word-modal-overlay" onClick={closeModal}>
          <div className="word-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="word-modal-header">
              <h2>{selectedWord.eng}</h2>
              <button className="modal-close-btn" onClick={closeModal}>
                <IoClose />
              </button>
            </div>
            
            <div className="word-modal-body">
              {selectedWord.meanings.length > 1 && (
                <div className="meaning-tabs">
                  {selectedWord.meanings.map((m, idx) => (
                    <button
                      key={idx}
                      className={`meaning-tab ${idx === selectedMeaningIndex ? 'active' : ''}`}
                      onClick={() => setSelectedMeaningIndex(idx)}
                    >
                      {m.uzb || `Meaning ${idx + 1}`}
                    </button>
                  ))}
                </div>
              )}

              {selectedWord.meanings.map((meaning, idx) => {
                if (idx !== selectedMeaningIndex) return null;
                
                return (
                  <div key={idx} className="meaning-content">
                    {meaning.type && (
                      <div className="meaning-section">
                        <span className="meaning-label">Type:</span>
                        <span className="meaning-value">{meaning.type}</span>
                      </div>
                    )}
                    
                    {meaning.uzb && (
                      <div className="meaning-section">
                        <span className="meaning-label">Uzbek:</span>
                        <span className="meaning-value">{meaning.uzb}</span>
                      </div>
                    )}
                    
                    {meaning.tran && (
                      <div className="meaning-section">
                        <span className="meaning-label">Transcription:</span>
                        <span className="meaning-value"><i>/{meaning.tran}/</i></span>
                      </div>
                    )}
                    
                    {meaning.syn && (
                      <div className="meaning-section">
                        <span className="meaning-label">Synonyms:</span>
                        <div className="meaning-value synonym-list" dangerouslySetInnerHTML={{ __html: meaning.syn }} />
                      </div>
                    )}
                    
                    {meaning.ant && (
                      <div className="meaning-section">
                        <span className="meaning-label">Antonyms:</span>
                        <div className="meaning-value antonym-list" dangerouslySetInnerHTML={{ __html: meaning.ant }} />
                      </div>
                    )}
                    
                    {meaning.exam && (
                      <div className="meaning-section">
                        <span className="meaning-label">Examples:</span>
                        <div className="meaning-value example-list">
                          {Array.isArray(meaning.exam) 
                            ? meaning.exam.map((ex, i) => <p key={i}>{ex}</p>)
                            : <p>{meaning.exam}</p>
                          }
                        </div>
                      </div>
                    )}

                    <div className="modal-actions">
                      <button
                        className={`favorite-modal-btn ${isFavorite(meaning) ? "favorited" : ""}`}
                        onClick={() => toggleFavorite(meaning)}
                      >
                        {isFavorite(meaning) ? "★ Favoritesdan o'chirish" : "☆ Favoritesga qo'shish"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
