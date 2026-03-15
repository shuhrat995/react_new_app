import { useState, useEffect } from "react";
import Logo from "../../../public/image.png";
import "./Loading.css"
export default function Loading({onFinish}) {
  const [phase, setPhase] = useState("idle");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("ring"), 100);
    const t2 = setTimeout(() => setPhase("content"), 900);
    const t3 = setTimeout(() => setPhase("fadeout"), 3000);
    const t4 = setTimeout(() => {
      setPhase("done");
      onFinish?.();
    }, 3600);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, []);

  if (phase == "done") return null;

  const show = phase === "content" || phase === "fadeout";
  const ringShow = phase === "ring" || show;
  return (
     <div className={`splash-overlay ${phase === "fadeout" ? "splash-fadeout" : ""}`}>
 
      {/* Fon nuqtalari */}
      <div className="splash-dots">
        {[...Array(24)].map((_, i) => (
          <div
            key={i}
            className="splash-dot"
            style={{
              width:   2 + (i % 3),
              height:  2 + (i % 3),
              top:  `${10 + (i % 6) * 15}%`,
              left: `${5  + Math.floor(i / 6) * 30}%`,
              opacity: 0.06 + (i % 4) * 0.04,
            }}
          />
        ))}
      </div>
 
      {/* Markaziy karta */}
      <div className="splash-card">
 
        {/* Ringlar + Logo */}
        <div className="splash-ring-wrap">
          <div className={`splash-ring ring-outer ${ringShow ? "ring-visible" : ""}`} />
          <div className={`splash-ring ring-mid   ${show     ? "ring-visible" : ""}`} />
          <div className={`splash-ring ring-inner ${show     ? "ring-visible" : ""}`} />
 
          <img
            src={Logo}
            alt="LexUz"
            className={`splash-logo ${ringShow ? "logo-visible" : ""}`}
          />
        </div>
 
        {/* Tagline */}
        <p className={`splash-tagline ${show ? "item-visible" : ""}`}>
          O'zbek tili lug'ati
        </p>
 
        {/* Badge */}
        <div className={`splash-badge ${show ? "item-visible" : ""}`}>
          <span className="badge-dot" />
          <span className="badge-text">14 000+ SO'Z</span>
        </div>
 
        {/* Progress bar */}
        <div className={`splash-progress-wrap ${show ? "item-visible" : ""}`}>
          <div className={`splash-progress-bar ${show ? "bar-full" : ""}`} />
        </div>
 
      </div>
    </div>
  );
}
