import { useState, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { SettingsProvider } from "./context/SettingsContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { App as CapacitorApp } from "@capacitor/app";
import Navbar from "./Components/Navbar/navbar.jsx";
import Search from "./Pages/Search/search.jsx";
import Settings from "./Pages/setting/setting.jsx";
import Favorites from "./Components/favorite/favorite.jsx";
import ExitModal from "./Components/ExitConfirm/ExitModal.jsx";
import Loading from "./Components/loading/loading.jsx";
import "./App.css";

function AppContent() {
    const location = useLocation();
    const navigate = useNavigate();
    const [showExitModal, setShowExitModal] = useState(false);

    useEffect(() => {
        const handleBackButton = () => {
            if (location.pathname === "/") {
                setShowExitModal(true);
            } else {
                navigate(-1);
            }
        };

        window.addEventListener("popstate", handleBackButton);

        CapacitorApp.addListener("backButton", () => {
            handleBackButton();
        });

        return () => {
            window.removeEventListener("popstate", handleBackButton);
            CapacitorApp.removeAllListeners();
        };
    }, [location, navigate]);

    const handleExitConfirm = () => {
        CapacitorApp.exitApp();
    };

    return (
        <>
            <ExitModal 
                isOpen={showExitModal} 
                onClose={() => setShowExitModal(false)} 
                onConfirm={handleExitConfirm} 
            />
            <div className="app-container">
                <Routes>
                    <Route path="/" element={<Search />} />
                    <Route path="/Settings" element={<Settings />} />
                    <Route path="/Favorites" element={<Favorites />} />
                </Routes>
                <Navbar />
            </div>
        </>
    );
}

function App() {
    const [splashDone, setSplashDone] = useState(false);

    if (!splashDone) {
        return <Loading onFinish={() => setSplashDone(true)} />;
    }

    return (
        <SettingsProvider>
            <FavoritesProvider>
                <AppContent />
            </FavoritesProvider>
        </SettingsProvider>
    );
}

export default App;
