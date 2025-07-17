import React, { useState } from 'react';

// A simple loader component
const Loader = () => <div className="loader"></div>;

function ReadingDisplayPage({ userQuery, selectedCards, cardData, setPage }) {
    const [interpretation, setInterpretation] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [enlargedCard, setEnlargedCard] = useState(null); // State to track enlarged card

    // Filter the main card data to get the details of the selected cards
    const readingCards = cardData.filter(card => selectedCards.includes(card.id));

    const handleCardClick = (cardId) => {
        // If the clicked card is already enlarged, shrink it. Otherwise, enlarge it.
        setEnlargedCard(enlargedCard === cardId ? null : cardId);
    };

    const getInterpretation = async () => {
        setIsLoading(true);
        setInterpretation('');

        const cardDetails = readingCards.map(card => `* ${card.name}: which represents '${card.interpretationPrompt}'`).join('\n');
        
        let prompt = `You are Archangel Gerry. A seeker has presented you with the following cards:\n${cardDetails}\n\n`;
        
        if (userQuery) {
            prompt += `They are seeking wisdom on the topic of: "${userQuery}". Please provide your wise, whimsical, and insightful interpretation, weaving together the specific meanings of these cards to address the seeker's query.`;
        } else {
            prompt += "Please provide a general but wise, whimsical, and insightful reading based on the combination of these four cards."
        }
        prompt += " Keep the reading to about 3-4 paragraphs."

        try {
            const chatHistory = [{ role: "user", parts: [{ text:prompt }] }];
            const payload = { contents: chatHistory };
            const apiKey = ""; // API key will be injected by the environment
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const result = await response.json();
            
            if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
                setInterpretation(result.candidates[0].content.parts[0].text);
            } else {
               setInterpretation("Gerry seems to be at a loss for words. Please try again.");
            }
        } catch (error) {
            console.error("Error fetching interpretation:", error);
            setInterpretation("It seems there was a disturbance in the cosmic connection to Gerry. Please check your connection and try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="page-container reading-page-bg">
            <header>
                <h1>Your Strangel Reading</h1>
                <p className="well-text">Click on a card to see it more closely.</p>
            </header>
            <main>
                <div className="reading-cards-grid">
                    {readingCards.map(card => (
                        <div 
                            key={card.id} 
                            // Add the 'enlarged' class if this card is the one selected
                            className={`reading-card ${enlargedCard === card.id ? 'enlarged' : ''}`}
                            onClick={() => handleCardClick(card.id)}
                        >
                            <img src={card.imageSrc} alt={card.alt} />
                        </div>
                    ))}
                </div>

                {!interpretation && !isLoading && (
                     <button onClick={getInterpretation} className="ask-gerry-button">
                        Ask Gemini To Consult With Archangel Gerry
                    </button>
                )}

                {isLoading && <Loader />}

                {interpretation && (
                    <>
                        <div className="interpretation-box">
                            {interpretation}
                        </div>
                        <div className="post-reading-options">
                             <button className="memento-button" onClick={() => alert('Memento feature coming soon!')}>
                                Save a Memento
                            </button>
                             <button className="journey-button" onClick={() => setPage('progress-to-heaven')}>
                                Help Gerry on His Journey
                            </button>
                        </div>
                    </>
                )}
                 <button onClick={() => setPage('home')} className="new-reading-button">
                    Start a New Reading
                </button>
            </main>
        </div>
    );
}

export default ReadingDisplayPage;