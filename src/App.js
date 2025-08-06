import React, { useState, useEffect } from "react";
import "./App.css";

// Import all the separate page components
import HomePage from "./HomePage";
import CardSelectionPage from "./CardSelectionPage";
import ReadingDisplayPage from "./ReadingDisplayPage";
import ProgressToHeavenPage from "./ProgressToHeavenPage";
import GerrysJournalPage from "./GerrysJournalPage"; 
import PrintShopPage from "./PrintShopPage";
import { CARD_DATA } from "./cardData";

// --- Header ---
const Header = ({ setPage, page }) => (
  <header className="app-header">
    <h1 className="main-title">Strangel Readings</h1>
    <nav>
      <a href="#home" onClick={() => setPage("home")} className={page === "home" ? "nav-active" : ""}>
        Home
      </a>
      <a href="#journal" onClick={() => setPage("journal")} className={page === "journal" ? "nav-active" : ""}>
        Gerry's Journal
      </a>
      <a
        href="#progress"
        onClick={() => setPage("progress-to-heaven")}
        className={page === "progress-to-heaven" ? "nav-active" : ""}
      >
        Progress to Heaven
      </a>
      <a href="#shop" onClick={() => setPage("shop")} className={page === "shop" ? "nav-active" : ""}>
        The Print Shop
      </a>
    </nav>
  </header>
);

// --- NEW, UPDATED FOOTER COMPONENT ---
const Footer = ({ setIsAdmin }) => {
  const [clickCount, setClickCount] = useState(0);

  const handleFooterClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);

    // When the count reaches 5, ask for the password
    if (newCount >= 5) {
      const password = prompt("Please enter the admin password:");
      if (password === "GerrysHelper") {
        alert("Admin access granted! You can now post as Archangel Gerry.");
        setIsAdmin(true);
      } else if (password) { // Only show alert if a password was entered
        alert("Incorrect password.");
      }
      setClickCount(0); // Reset for next time
    }
  };

  return (
    <footer className="app-footer">
      <p onClick={handleFooterClick} style={{cursor: 'pointer', userSelect: 'none'}}>
        © 2025 Strangel Readings. All rights reserved.
      </p>
    </footer>
  );
};


// --- App Component ---
function App() {
  const [page, setPage] = useState("home");
  const [userQuery, setUserQuery] = useState("");
  const [selectedCards, setSelectedCards] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false); // Manages admin status

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
      case "journal":
        // Pass the admin status to the journal page
        return <GerrysJournalPage isAdmin={isAdmin} />;
      case "progress-to-heaven":
        return <ProgressToHeavenPage />;
      case "shop":
        return <PrintShopPage setPage={setPage} />;
      case "home":
      default:
        return <HomePage setPage={setPage} />;
    }
  };

  return (
    <div className="App">
      <Header setPage={setPage} page={page} />
      <main className="app-content">{renderPage()}</main>
      <Footer setIsAdmin={setIsAdmin} />
    </div>
  );
}

export default App;


