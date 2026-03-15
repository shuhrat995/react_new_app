import { useEffect } from "react";

export default function ExitModal({ isOpen, onClose, onConfirm }) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="exit-modal-overlay" onClick={onClose}>
            <div className="exit-modal-content" onClick={e => e.stopPropagation()}>
                <div className="exit-modal-icon">⚠️</div>
                <h2 className="exit-modal-title">Chiqish</h2>
                <p className="exit-modal-text">Haqiqatan ham ilovadan chiqasizmi?</p>
                <div className="exit-modal-buttons">
                    <button className="exit-btn-cancel" onClick={onClose}>
                        Yo'q
                    </button>
                    <button className="exit-btn-confirm" onClick={onConfirm}>
                        Ha, chiqish
                    </button>
                </div>
            </div>
        </div>
    );
}
