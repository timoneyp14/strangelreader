import React, { useEffect, useState } from 'react';
import { CARD_DATA } from './cardData'; // Import card data

function CardSelectionPage({ userQuery, setUserQuery, setSelectedCards, setPage, selectedCards }) {
  const [shuffledCardIds, setShuffledCardIds] = useState([]);
  const cardBackImage = 'https://images.squarespace-cdn.com/content/v1/63c124b461cb3504b7ab4e26/570bdf49-e945-41d5-9d2a-31292377d4c4/IMG_5264.jpeg?format=1500w';
  const [echoMessage, setEchoMessage] = useState('');
  const [isFadingOut, setIsFadingOut] = useState(false);
  
  // States for magical effects
  const [isFocused, setIsFocused] = useState(false);
  const [showRipple, setShowRipple] = useState(false);
  const [isWellTold, setIsWellTold] = useState(false); // New state to track if well has been told

  useEffect(() => {
    const cardIds = Array.from({ length: CARD_DATA.length }, (_, i) => i + 1);
    
    for (let i = cardIds.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cardIds[i], cardIds[j]] = [cardIds[j], cardIds[i]];
    }
    
    setShuffledCardIds(cardIds);
  }, []);

  const toggleCardSelection = (cardId) => {
    setSelectedCards(prevSelected => {
      if (prevSelected.includes(cardId)) {
        return prevSelected.filter(id => id !== cardId);
      } else {
        if (prevSelected.length < 4) {
          return [...prevSelected, cardId];
        }
      }
      return prevSelected;
    });
  };

  // This function is now simplified to be more robust
  const handleTellTheWell = () => {
      if (userQuery.trim()) {
          setIsWellTold(true); // Disable the button after clicking
          setEchoMessage('Your words echo back in a voice that is not your own.');
          setShowRipple(true); // Trigger the ripple effect

          // Hide the echo message after a few seconds
          setTimeout(() => {
              setEchoMessage('');
          }, 4000);

          // Reset the ripple effect class
          setTimeout(() => {
            setShowRipple(false);
          }, 1000);
      }
  };

  useEffect(() => {
    if (selectedCards.length === 4) {
      setIsFadingOut(true); 
      setTimeout(() => {
        setPage('reading-display');
        setIsFadingOut(false); 
      }, 4000); 
    }
  }, [selectedCards, setPage]);

  return (
    <div className={`page-container card-selection-page ${isFadingOut ? 'dissolving-out' : ''}`}>
      <header>
        <h1>Gerry's Well of Wisdom</h1>
        <p className="well-text">Ah... you have arrived at Gerry's Well of Wisdom. Enjoy the gentle sway of the golden waters as you gaze into its depths.</p>
        <p className="well-text">You may share with the well a topic or question that you would like to explore through your reading. Or you can choose your cards in contemplative silence and trust that Archangel Gerry and Gemini will intuit what you most need to know.</p>
      </header>
      <main>
        <div className={`well-container ${showRipple ? 'ripple-effect' : ''}`}>
            <video
                className="video-responsive"
                src="https://firebasestorage.googleapis.com/v0/b/strangel-readings.firebasestorage.app/o/gerrys%20well%20of%20wisdom.mp4?alt=media&token=977da523-1ce4-4eea-aabc-0084d3698b30"
                autoPlay
                loop
                muted
                playsInline
            ></video>
        </div>
        
        <p className="well-text">
            Feel free to approach the well with any manner of inquiry. It can be serious or silly, terribly pressing or about trouser pressing. The more information that you tell the well, the more personalised your reading will be.
        </p>
        <p className="well-text italic">Rest assured, your words are whispered only to the well. They are heard once for your reading, then vanish into the mists.</p>
        
        <div className={`query-box ${isFocused ? 'focused' : ''}`}>
          <textarea
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            rows="6"
            placeholder="Type your question or topic here..."
            readOnly={isWellTold} // Make textarea readonly after sending
          />
          <button onClick={handleTellTheWell} disabled={isWellTold}>
            {isWellTold ? 'The Well is Listening...' : 'Tell The Well'}
          </button>
          {echoMessage && <p className="echo-message">{echoMessage}</p>}
        </div>

        <h2 style={{marginTop: '2rem'}}>Choose four cards.</h2>
        <p>Selected: {selectedCards.length} of 4</p>
        <div className="card-grid">
            {shuffledCardIds.map(id => (
              <div
                key={id}
                className={`card-back ${selectedCards.includes(id) ? 'selected' : ''}`}
                onClick={() => toggleCardSelection(id)}
              >
                <img src={cardBackImage} alt="Strangel Card Back" />
              </div>
            ))}
        </div>
      </main>
    </div>
  );
}
export default CardSelectionPage;