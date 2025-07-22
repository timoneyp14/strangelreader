import React, { useState, useEffect } from "react";
import "./App.css";

// Import all the separate page components
import HomePage from "./HomePage";
import CardSelectionPage from "./CardSelectionPage";
import ReadingDisplayPage from "./ReadingDisplayPage";
import ProgressToHeavenPage from "./ProgressToHeavenPage";
import AboutGerryPage from "./AboutGerryPage"; 
import { CARD_DATA } from "./cardData";

// --- THIS IS THE MISSING LINE ---
import './ProgressToHeavenPage.css';

// --- Header ---
const Header = ({ setPage, page }) => (
  <header className="app-header">
    <h1 className="main-title">Strangel Readings</h1>
    <nav>
      <a href="#home" onClick={() => setPage("home")} className={page === "home" ? "nav-active" : ""}>
        Home
      </a>
      <a href="#about" onClick={() => setPage("about-gerry")} className={page === "about-gerry" ? "nav-active" : ""}>
        About Gerry
      </a>
      <a
        href="#progress"
        onClick={() => setPage("progress-to-heaven")}
        className={page === "progress-to-heaven" ? "nav-active" : ""}
      >
        Progress to Heaven
      </a>
    </nav>
  </header>
);

// --- Footer ---
const Footer = () => (
  <footer className="app-footer">
    <p>© 2025 Strangel Readings. All rights reserved.</p>
  </footer>
);

// --- App Component ---
function App() {
  const [page, setPage] = useState("home");
  const [userQuery, setUserQuery] = useState("");
  const [selectedCards, setSelectedCards] = useState([]);

  // Reset state when leaving reading pages
  useEffect(() => {
    if (page !== "reading-display" && page !== "well-of-wisdom") {
      setUserQuery("");
      setSelectedCards([]);
    }
  }, [page]);

  const renderPage = () => {
    switch (page) {
      case "well-of-wisdom":
        return (
          <CardSelectionPage
            userQuery={userQuery}
            setUserQuery={setUserQuery}
            selectedCards={selectedCards}
            setSelectedCards={setSelectedCards}
            setPage={setPage}
          />
        );
      case "reading-display":
        return (
          <ReadingDisplayPage
            userQuery={userQuery}
            selectedCards={selectedCards}
            cardData={CARD_DATA}
            setPage={setPage}
          />
        );
      case "about-gerry":
        return <AboutGerryPage />;
      case "progress-to-heaven":
        return <ProgressToHeavenPage />;
      case "home":
      default:
        return <HomePage setPage={setPage} />;
    }
  };

  return (
    <div className="App">
      <Header setPage={setPage} page={page} />
      <main className="app-content">{renderPage()}</main>
      <Footer />
    </div>
  );
}

export default App;