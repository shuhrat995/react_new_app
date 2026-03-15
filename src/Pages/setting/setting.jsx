import { useState } from "react";
import "./setting.css";
import { useSettings } from "../../context/SettingsContext";
import { IoCopyOutline, IoCheckmarkOutline } from "react-icons/io5";

const ChevronIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M6 9l6 6 6-6" />
  </svg>
);

export default function Settings() {
  const { theme, setTheme, lang, setLang, fontSize, setFontSize } = useSettings();
  const [cardCopied, setCardCopied] = useState(false);

  const handleCopyCard = () => {
    navigator.clipboard.writeText("9860 1966 1662 98**");
    setCardCopied(true);
    setTimeout(() => setCardCopied(false), 2000);
  };

  return (
    <div className="page-settings">
      <div className="ph">
        <h1>Sozlamalar</h1>
      </div>

      <div className="set-scroll">

        {/* tema */}
        <div className="set-group">
          <label className="set-group-label">Mavzu</label>
          <div className="set-select-wrap">
            <select value={theme} onChange={e => setTheme(e.target.value)} className="set-select">
              <option value="light">Light ☀️</option>
              <option value="dark">Dark 🌙</option>
            </select>
            <ChevronIcon />
          </div>
        </div>

        {/* til */}
        <div className="set-group">
          <label className="set-group-label">
            {lang === "uz" ? "Til" : "Language"}
          </label>
          <div className="set-select-wrap">
            <select value={lang} onChange={e => setLang(e.target.value)} className="set-select">
              <option value="uz">O'zbekcha</option>
              <option value="en">English</option>
            </select>
            <ChevronIcon />
          </div>
        </div>

        {/* shrift */}
        <div className="set-group">
          <label className="set-group-label">
            {lang === "uz" ? "Shrift o'lchami" : "Font size"}
          </label>
          <div className="set-select-wrap">
            <select value={fontSize} onChange={e => setFontSize(e.target.value)} className="set-select">
              <option value="small">Small 🔽</option>
              <option value="medium">Medium 🔸</option>
              <option value="large">Large 🔼</option>
            </select>
            <ChevronIcon />
          </div>
        </div>

        <main>
                <div className="coffee-container">
                    <div className="emoji-big">☕</div>
                    <h1>Buy me a coffee</h1>
                    <p>
                        If you like this dictionary app and
                        want to support its development,
                        you can send me a small donation.
                        Thank you!
                    </p>
                    <div className="coffee-number" onClick={handleCopyCard}>
                        <span className="card-text">9860 1966 1662 98**</span>
                        <span className="card-icon">
                            {cardCopied ? <IoCheckmarkOutline /> : <IoCopyOutline />}
                        </span>
                    </div>
                    <p className="coffee-hint">
                        {cardCopied ? "Nusxalandi! ✓" : (lang === "uz" ? "Nusxalash uchun bosing" : "Tap to copy")}
                    </p>
                </div>
            </main>

      </div>
    </div>
  );
}