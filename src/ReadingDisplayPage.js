import React, { useState } from 'react';
import { CARD_DATA } from './cardData.js';

function ReadingDisplayPage({ userQuery, selectedCards, setPage }) {
  const [interpretation, setInterpretation] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPostReadingOptions, setShowPostReadingOptions] = useState(false);

  const displayedCards = selectedCards.map(id => CARD_DATA.find(card => card.id === id)).filter(Boolean);

  const handleGetInterpretation = async () => {
    setLoading(true);
    setShowPostReadingOptions(false);

    try {
      const response = await fetch('http://localhost:5001/api/get-reading', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: userQuery,
          cards: displayedCards,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setInterpretation(data.reading);
      setShowPostReadingOptions(true);

    } catch (error) {
      console.error("Failed to fetch reading:", error);
      setInterpretation("Sorry, there was an error connecting to the server. Please ensure the backend server is running and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMemento = async (event) => {
    event.target.disabled = true;
    event.target.textContent = 'Creating...';

    const prompt = `You are Archangel Gerry. Please summarize the essence of this reading into a single, wise, and whimsical sentence: "${interpretation}"`;
    let summaryQuote = "May your path be strange and wonderful."; // Default quote

    try {
        const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
        const payload = { contents: chatHistory };
        const apiKey = "";
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (response.ok) {
            const result = await response.json();
            if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
                summaryQuote = result.candidates[0].content.parts[0].text;
            }
        }
    } catch (error) {
        console.error("Error getting summary quote:", error);
    }

    const cardImagesHTML = displayedCards.map(card => `
        <div style="width: 200px; height: 300px; margin: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.2); border-radius: 1rem; overflow: hidden;">
            <img src="${card.imageSrc}" alt="${card.name}" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
    `).join('');

    const mementoHTML = `
        <html><head><title>Your Strangel Reading Memento</title><style>
        body { font-family: "Georgia", "Times New Roman", serif; background-color: #FEF3C7; text-align: center; padding: 2rem; }
        h1 { color: #581c87; } .cards-container { display: flex; flex-wrap: wrap; justify-content: center; margin-top: 2rem; }
        .quote { font-style: italic; font-size: 1.25rem; margin-top: 2rem; color: #581c87; }
        .print-button { margin-top: 2rem; padding: 0.75rem 1.5rem; font-size: 1rem; color: white; background-color: #7e22ce; border: none; border-radius: 0.5rem; cursor: pointer; }
        @media print { .print-button { display: none; } }
        </style></head><body><h1>Your Strangel Reading</h1><div class="cards-container">${cardImagesHTML}</div>
        <p class="quote">"${summaryQuote}"</p><button class="print-button" onclick="window.print()">Print Memento</button></body></html>
    `;

    const newWindow = window.open("", "_blank");
    newWindow.document.write(mementoHTML);
    newWindow.document.close();

    event.target.disabled = false;
    event.target.textContent = 'Save a Memento';
  };

  return (
    <div className="page-container reading-page-bg">
      <header>
        <h1>Your Strangel Reading</h1>
      </header>
      <main>
        <div className="reading-cards-grid">
          {displayedCards.map(card => (
            <div key={card.id} className="reading-card">
              <img src={card.imageSrc} alt={card.alt} />
            </div>
          ))}
        </div>

        {!interpretation && !loading && (
            <button onClick={handleGetInterpretation} className="ask-gerry-button">
                Ask Gerry to Interpret
            </button>
        )}
        
        {loading && <div className="loader"></div>}

        {interpretation && (
          <div className="interpretation-box">
            <p>{interpretation}</p>
          </div>
        )}

        {showPostReadingOptions && (
            <div className="post-reading-options">
                <button className="memento-button" onClick={handleSaveMemento}>Save a Memento</button>
                <button className="journey-button" onClick={() => setPage('progress-to-heaven')}>Help Gerry on His Journey</button>
            </div>
        )}

        <button onClick={() => setPage('home')} className="new-reading-button">Start a New Reading</button>
      </main>
    </div>
  );
}

export default ReadingDisplayPage;