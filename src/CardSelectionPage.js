import React, { useEffect, useState, useRef } from 'react';
import { CARD_DATA } from './cardData'; // Import card data
import SubscribeForm from './SubscribeForm';

function CardSelectionPage({ userQuery, setUserQuery, setSelectedCards, setPage, selectedCards }) {
  const [shuffledCardIds, setShuffledCardIds] = useState([]);
  const cardBackImage = 'https://images.squarespace-cdn.com/content/v1/63c124b461cb3504b7ab4e26/570bdf49-e945-41d5-9d2a-31292377d4c4/IMG_5264.jpeg?format=1500w';
  const [isFadingOut, setIsFadingOut] = useState(false);
  
  const [isFocused, setIsFocused] = useState(false);
  const [showRipple, setShowRipple] = useState(false);
  const [isWellTold, setIsWellTold] = useState(false); 
  
  // --- NEW: State for the new animation effects ---
  const [echoLetters, setEchoLetters] = useState([]);
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const echoContainerRef = useRef(null);


  // --- Component-specific styles including the new mystical effects ---
  const pageStyles = `
    /* --- NEW: Styles for the Echoing Letters & Final Message --- */
    .query-box {
        position: relative;
        min-height: 278px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .query-content.submitted {
        opacity: 0;
        pointer-events: none;
    }

    .echo-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        padding: 2rem;
        pointer-events: none;
    }

    @keyframes echo-up {
        0% { transform: translateY(0) scale(1); opacity: 1; }
        100% { transform: translateY(-100px) scale(0.5); opacity: 0; }
    }

    .echo-letter {
        display: inline-block;
        color: #4c1d95;
        font-size: 1.2rem;
        font-weight: bold;
        opacity: 0;
        animation-name: echo-up;
        animation-timing-function: ease-out;
        animation-fill-mode: forwards;
    }

    .final-message {
        position: absolute;
        text-align: center;
        color: #4c1d95;
        font-weight: bold;
        font-size: 1.2rem;
        opacity: 0;
        transition: opacity 2s ease-in-out;
        padding: 2rem;
    }
    
    .final-message.visible {
        opacity: 1;
    }


    /* --- Existing styles for mobile layout fixes --- */
    @media (max-width: 768px) {
      .query-box {
        width: 90%;
        margin-left: auto;
        margin-right: auto;
      }
      .query-box textarea {
        min-height: 120px;
      }
      .card-grid {
        justify-content: center;
      }
    }
  `;

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
      } else if (prevSelected.length < 4) {
        return [...prevSelected, cardId];
      }
      return prevSelected;
    });
  };

  // --- UPDATED: handleTellTheWell function with new logic ---
  const handleTellTheWell = () => {
      if (userQuery.trim() && !isWellTold) {
          // 1. Trigger the original ripple effect on the video
          setShowRipple(true);
          setTimeout(() => setShowRipple(false), 1000);

          // 2. Set state to start the new animations
          setIsWellTold(true);
          
          // 3. Create the letter objects for the echo animation
          const letters = userQuery.split('');
          let maxAnimationTime = 0;
          const letterObjects = letters.map((char, index) => {
              const duration = Math.random() * 2 + 2; // 2s to 4s
              const delay = Math.random() * 2;       // 0s to 2s
              if (delay + duration > maxAnimationTime) {
                  maxAnimationTime = delay + duration;
              }
              return {
                  char,
                  id: index,
                  style: {
                      animationDuration: `${duration}s`,
                      animationDelay: `${delay}s`,
                  }
              };
          });
          setEchoLetters(letterObjects);

          // 4. Schedule the final message to appear
          setTimeout(() => {
              setShowFinalMessage(true);
          }, (maxAnimationTime * 1000) / 2); // Start halfway through
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
    <>
      <style>{pageStyles}</style>
      <div className={`page-container card-selection-page ${isFadingOut ? 'dissolving-out' : ''}`}>
        <header>
          <h1>Gerry's Well of Wisdom</h1>
          <p className="well-text">
              Ah... Seeker... you have arrived at the Well of Wisdom. You may drop in a question, concern or topic for your reading or choose from the cards below in contemplative silence. The more you tell the well, the more personal your reading will be. Rest assured, your words, once heard, will vanish forever into the glowing golden waters.
          </p>
        </header>
        <main>
          {/* The original well container with its ripple effect logic unchanged */}
          <div className={`well-container ${showRipple ? 'ripple-effect' : ''}`}>
              <video
                  className="video-responsive"
                  src="https://firebasestorage.googleapis.com/v0/b/strangel-readings.firebasestorage.app/o/gerrys%20well%20of%20wisdom.mp4?alt=media&token=977da523-1ce4-4eea-aabc-0084d3698b30"
                  autoPlay
                  loop
                  muted
                  playsInline
                  poster="https://images.squarespace-cdn.com/content/v1/63c124b461cb3504b7ab4e26/e33a3528-2558-4598-82a1-02638e37e51a/well+of+wisdom.jpg?format=1500w"
              ></video>
          </div>
          
          <div className={`query-box`}>
            {/* The original form, which will be hidden when submitted */}
            <div className={`query-content ${isWellTold ? 'submitted' : ''}`}>
              <textarea
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                rows="6"
                placeholder="Whisper your secrets to the water..."
                readOnly={isWellTold} 
              />
              <button onClick={handleTellTheWell} disabled={isWellTold}>
                {isWellTold ? 'The Well is Listening...' : 'Tell The Well'}
              </button>
            </div>

            {/* The new container for the echoing letters */}
            {isWellTold && (
              <div ref={echoContainerRef} className="echo-container">
                {echoLetters.map(letter => (
                  letter.char === ' ' 
                    ? <span key={letter.id}>&nbsp;</span>
                    : <span key={letter.id} className="echo-letter" style={letter.style}>{letter.char}</span>
                ))}
              </div>
            )}
            
            {/* The new final message */}
            <p className={`final-message ${showFinalMessage ? 'visible' : ''}`}>
              your thoughts echo back in a voice that is not your own...
            </p>
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
    </>
  );
}
export default CardSelectionPage;