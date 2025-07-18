import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import HomePage from './HomePage';
import CardSelectionPage from './CardSelectionPage';
import ReadingDisplayPage from './ReadingDisplayPage';
import ProgressToHeavenPage from './ProgressToHeavenPage';
import AdminPage from './AdminPage'; 
import './ProgressToHeavenPage.css';
import './AdminPage.css'; 
import { CARD_DATA } from './cardData';

// --- Placeholder Pages ---
const AboutGerryPage = () => (
    <div className="page-container about-gerry-page">
        <h1>Archangel Gerry's Story</h1>
        <p className="intro-text">
            Once, in a time not so long ago, Gerry walked the Earth as a human. He wasn't a tremendously brilliant human, and led, what could perhaps best be described as a ne'er-do-well existence. However, in the last few seconds of his life, a child darted into the path of an oncoming vehicle. In that instant, all the noise of Gerry's life muted, and there was only a single, clear and noble choice. He intervened, dived into the road and pushed the child to safety. Gerry was killed in the process. His soul, unburdened by the chance to second-guess, felt a profound sense of peace. He had, without question or regret, finally done something true.
        </p>
        <p className="intro-text">
            When Saint Peter met Gerry at the gates of Heaven, he couldn't, in good conscience, turn him away. Despite Gerry's prior existence, it wouldn't be proper to ignore his final act of self-sacrifice and bravery. So, Saint Peter offered Gerry a chance to earn his way to Heaven: by collaborating with Paul Timoney and sharing the strange and crooked wisdom he'd gathered from a life lived in the margins. And so, Archangel Gerry was born, continuing his mission to offer guidance and a weird, fresh perspective to all who seek it.
        </p>
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
                {/* The public link to the Admin page has been removed */}
            </nav>
        </header>
    );
};

// --- Footer Component (with secret admin access) ---
const Footer = ({ setPage }) => {
    const [clickCount, setClickCount] = useState(0);
    const clickTimeout = useRef(null);

    const handleFooterClick = () => {
        // Clear the previous timeout to reset the timer
        if (clickTimeout.current) {
            clearTimeout(clickTimeout.current);
        }

        const newClickCount = clickCount + 1;
        setClickCount(newClickCount);

        if (newClickCount >= 5) {
            setPage('admin'); // Navigate to the admin page
            setClickCount(0); // Reset the counter
        } else {
            // Set a timer to reset the count if the user stops clicking
            clickTimeout.current = setTimeout(() => {
                setClickCount(0);
            }, 2000); // 2-second window to complete the 5 clicks
        }
    };
    
    // Cleanup the timeout when the component unmounts
    useEffect(() => {
        return () => {
            if (clickTimeout.current) {
                clearTimeout(clickTimeout.current);
            }
        };
    }, []);


    return (
        <footer className="app-footer">
            <p onClick={handleFooterClick} style={{ cursor: 'pointer' }}>
                © 2025 Strangel Readings. All rights reserved.
            </p>
        </footer>
    );
};

// --- Main App Component ---
function App() {
  const [page, setPage] = useState('home');
  const [userQuery, setUserQuery] = useState('');
  const [selectedCards, setSelectedCards] = useState([]);

  useEffect(() => {
    if (page !== 'reading-display' && page !== 'well-of-wisdom') {
        setUserQuery('');
        setSelectedCards([]);
    }
  }, [page]);

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
                  setPage={setPage}
               />;
      case 'about-gerry':
        return <AboutGerryPage />;
      case 'progress-to-heaven':
        return <ProgressToHeavenPage />;
      case 'admin':
        return <AdminPage />;
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
        {/* Pass the setPage function to the Footer */}
        <Footer setPage={setPage} />
    </div>
  );
}

export default App;
