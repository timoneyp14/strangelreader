import React, { useEffect, useState } from 'react';

function CardSelectionPage({ userQuery, setUserQuery, setSelectedCards, setPage, selectedCards }) {
  const [shuffledCardIds, setShuffledCardIds] = useState([]);
  const cardBackImage = 'https://images.squarespace-cdn.com/content/v1/63c124b461cb3504b7ab4e26/570bdf49-e945-41d5-9d2a-31292377d4c4/IMG_5264.jpeg?format=1500w';
  const [echoMessage, setEchoMessage] = useState('');

  // This effect runs only once when the component mounts to shuffle the cards
  useEffect(() => {
    const cardIds = Array.from({ length: 32 }, (_, i) => i + 1);
    
    // Fisher-Yates shuffle algorithm
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

  const handleTellTheWell = () => {
      if (userQuery.trim()) {
          setEchoMessage('Your words echo back in a voice that is not your own.');
          setTimeout(() => {
              setEchoMessage('');
          }, 4000);
      }
  };

  useEffect(() => {
    if (selectedCards.length === 4) {
      setTimeout(() => {
        setPage('reading-display');
      }, 1500);
    }
  }, [selectedCards, setPage]);

  return (
    <div className="page-container">
      <header>
        <h1>Gerry's Well of Wisdom</h1>
        <p className="well-text">Ah... you have arrived at Gerry's Well of Wisdom. Enjoy the gentle sway of the golden waters as you gaze into its depths.</p>
        <p className="well-text">You may share with the well a topic or question that you would like to explore through your reading. Or you can choose your cards in contemplative silence and trust that Archangel Gerry and Gemini will intuit what you most need to know.</p>
      </header>
      <main>
        <div className="well-container">
            <iframe
                className="video-responsive"
                src="https://www.youtube.com/embed/dIR8vLuZg_k?autoplay=1&loop=1&playlist=dIR8vLuZg_k&controls=0&mute=1&playsinline=1&modestbranding=1"
                frameBorder="0"
                allow="autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Gerry's Well of Wisdom Video"
            ></iframe>
            <div className="well-overlay"></div>
            <div className="video-frame"></div>
        </div>
        
        <p className="well-text">
            Feel free to approach the well with any manner of inquiry. It can be serious or silly, terribly pressing or about trouser pressing. The more information that you tell the well, the more personalised your reading will be.
        </p>
        <p className="well-text italic">Rest assured, your words are whispered only to the well. They are heard once for your reading, then vanish into the mists.</p>

        <div className="query-box">
          <textarea
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            rows="6"
            placeholder="Type your question or topic here..."
          />
          <button onClick={handleTellTheWell}>Tell The Well</button>
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

