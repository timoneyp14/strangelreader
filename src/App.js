import React, { useState } from 'react';
import './App.css';
import HomePage from './HomePage';
import CardSelectionPage from './CardSelectionPage';
import ReadingDisplayPage from './ReadingDisplayPage';
import { CARD_DATA } from './cardData'; // Import the card data

// --- Placeholder Pages ---
const AboutGerryPage = () => (
    <div className="page-container about-gerry-page">
        <h1>Archangel Gerry's Story</h1>
        {/* The className="intro-text" has been added to both paragraphs */}
        <p className="intro-text">
            Once, in a time not so long ago, Gerry walked the Earth as a human. He wasn't a tremendously brilliant human, and led, what could perhaps best be described as a ne'er-do-well existence. However, in the last few seconds of his life, a child darted into the path of an oncoming vehicle. In that instant, all the noise of Gerry's life muted, and there was only a single, clear and noble choice. He intervened, dived into the road and pushed the child to safety. Gerry was killed in the process. His soul, unburdened by the chance to second-guess, felt a profound sense of peace. He had, without question or regret, finally done something true.
        </p>
        <p className="intro-text">
            When Saint Peter met Gerry at the gates of Heaven, he couldn't, in good conscience, turn him away. Despite Gerry's prior existence, it wouldn't be proper to ignore his final act of self-sacrifice and bravery. So, Saint Peter offered Gerry a chance to earn his way to Heaven: by collaborating with Paul Timoney and sharing the strange and crooked wisdom he'd gathered from a life lived in the margins. And so, Archangel Gerry was born, continuing his mission to offer guidance and a weird, fresh perspective to all who seek it.
        </p>
    </div>
);

const ProgressToHeavenPage = () => (
    <div className="page-container">
        <h1>Progress to Heaven</h1>
        <p>This page will show Gerry's journey to the heavens.</p>
    </div>
);

// --- Header Component ---
const Header = ({ setPage, page }) => {
    return (
        <header className="app-header">
            <h1 className="main-title">Strangel Readings</h1>
            <nav>
                <a href="#home" onClick={() => setPage('home')} className={page === 'home' ? 'nav-active' : ''}>Home</a>
                <a href="#about" onClick={() => setPage('about-gerry')} className={page === 'about-gerry' ? 'nav-active' : ''}>About Gerry</a>
                <a href="#progress" onClick={() => setPage('progress-to-heaven')} className={page === 'progress-to-heaven' ? 'nav-active' : ''}>Progress to Heaven</a>
            </nav>
        </header>
    );
};

// --- Footer Component ---
const Footer = () => {
    return (
        <footer className="app-footer">
            <p>© 2025 Strangel Readings. All rights reserved.</p>
        </footer>
    );
};

// --- Main App Component ---
function App() {
  const [page, setPage] = useState('home');
  const [userQuery, setUserQuery] = useState('');
  const [selectedCards, setSelectedCards] = useState([]);

  // Function to reset the state for a new reading
  const navigateHome = () => {
      setUserQuery('');
      setSelectedCards([]);
      setPage('home');
  }

  const renderPage = () => {
    switch (page) {
      case 'well-of-wisdom':
        return <CardSelectionPage
                  userQuery={userQuery}
                  setUserQuery={setUserQuery}
                  selectedCards={selectedCards}
                  setSelectedCards={setSelectedCards}
                  setPage={setPage}
               />;
      case 'reading-display':
        return <ReadingDisplayPage
                  userQuery={userQuery}
                  selectedCards={selectedCards}
                  cardData={CARD_DATA}
                  setPage={navigateHome} // Pass navigateHome to allow reset
               />;
      case 'about-gerry':
        return <AboutGerryPage />;
      case 'progress-to-heaven':
        return <ProgressToHeavenPage />;
      case 'home':
      default:
        return <HomePage
                  setPage={setPage}
               />;
    }
  };

  return (
    <div className="App">
        <Header setPage={setPage} page={page} />
        <main className="app-content">
            {renderPage()}
        </main>
        <Footer />
    </div>
  );
}

export default App;
