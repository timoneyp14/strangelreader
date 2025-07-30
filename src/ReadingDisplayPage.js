import React, { useState } from 'react';
import MementoPage from './MementoPage';

// A simple loader component - this can be enhanced if desired
const Loader = ({ message }) => (
    <div className="loader-container">
        <div className="loader"></div>
        <p className="loading-message">{message}</p>
    </div>
);


function ReadingDisplayPage({ userQuery, selectedCards, cardData, setPage }) {
    const [interpretation, setInterpretation] = useState('');
    const [memento, setMemento] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [enlargedCardId, setEnlargedCardId] = useState(null);
    const [showMementoPage, setShowMementoPage] = useState(false); 
    // --- NEW: State for more descriptive loading messages ---
    const [loadingMessage, setLoadingMessage] = useState("Archangel Gerry is consulting the celestial planes...");

    const readingCards = cardData.filter(card => selectedCards.includes(card.id));

    const getInterpretation = async () => {
        setIsLoading(true);
        setInterpretation('');
        setMemento('');
        setLoadingMessage("Archangel Gerry is consulting the celestial planes..."); // Reset message

        const cardDetails = readingCards.map(card => {
            const randomIndex = Math.floor(Math.random() * card.interpretationPrompts.length);
            const randomPrompt = card.interpretationPrompts[randomIndex];
            return `* ${card.name}: A key detail is '${randomPrompt}'`;
        }).join('\n');

        let prompt = `
Imagine you had to use these cards to create a really useful piece of life advice for someone who needs it. Create a 500-word text as if you, Gemini, had consulted with a great, kind, wise, and lighthearted sage named Archangel Gerry.
The reading should be a summary of your consultation. It can be a dialogue or a unified voice. The tone must be insightful, empathetic, caring, and genuinely useful. Avoid simple platitudes.
The seeker has drawn four cards, and for each, a key visual detail has been noted. Please make connections between these specific elements from the different cards to form your reading.
The cards and their key details are:
${cardDetails}
        `;

        if (userQuery) {
            prompt += `\nThey have specifically asked for guidance on: "${userQuery}". Please address that question in a helpful and empathic way, using the card details as your guide.`;
        } else {
            prompt += `\nThey have not asked a question, so please use the card details as your sole guide to provide the wisdom they most need to hear.`;
        }

        prompt += `\n\nAfter the main reading, on a new line, provide a single, unique sentence that encapsulates the core wisdom of this specific reading. This sentence must be a maximum of 30 words. Start this line with "Memento:"`;

        // --- Retry Logic Implementation ---
        const maxRetries = 3;
        let attempt = 0;
        
        while (attempt < maxRetries) {
            try {
                const response = await fetch("https://us-central1-strangelreadingslive.cloudfunctions.net/getReading", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ prompt })
                });

                if (!response.ok) {
                    // This will be caught by the catch block below and trigger a retry
                    // We include the status to provide more detailed error logging.
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                const resultText = data.text;

                if (resultText) {
                    const parts = resultText.split("\nMemento:");
                    setInterpretation(parts[0].trim());
                    setMemento(parts[1] ? parts[1].trim() : "May your path be strange and wonderful.");
                } else {
                    // If we get a valid response but no text, treat it as an error to retry
                    throw new Error("Empty response from the celestial planes.");
                }
                
                // If we succeed, exit the loop
                break; 

            } catch (error) {
                attempt++;
                // --- UPDATED: More detailed error logging ---
                console.error(`Reading generation attempt ${attempt} failed. Reason:`, error.message);

                if (attempt >= maxRetries) {
                    // If this was the last attempt, set the final error message
                    setInterpretation("Gerry's connection to the celestial planes seems to be blocked by cosmic interference. Please check your internet connection and try your reading again. If the problem persists, the heavens may need a moment to clear.");
                    break; 
                } else {
                    // If we have more retries left, wait and update the message
                    setLoadingMessage("The connection is faint... trying again.");
                    const delay = Math.pow(2, attempt) * 1000; // Exponential backoff: 2s, 4s
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }
        // --- End of Retry Logic ---

        setIsLoading(false);
    };
    
    if (showMementoPage) {
        return (
            <MementoPage 
                readingCards={readingCards} 
                mementoText={memento} 
                onBack={() => setPage('home')} 
            />
        );
    }

    const enlargedCard = enlargedCardId ? cardData.find(card => card.id === enlargedCardId) : null;

    return (
        <div className="page-container reading-page-bg card-selection-page">
            <header>
                <h1>Your Strangel Reading</h1>
                <p className="well-text">Click on a card to see it more closely.</p>
            </header>
            <main>
                <div className="reading-cards-grid">
                    {readingCards.map(card => (
                        <div key={card.id} className="reading-card" onClick={() => setEnlargedCardId(card.id)}>
                            <img src={card.imageSrc} alt={card.name} />
                        </div>
                    ))}
                </div>

                {!interpretation && !isLoading && (
                     <button onClick={getInterpretation} className="ask-gerry-button">
                        Ask Gemini To Consult With Archangel Gerry
                    </button>
                )}

                {/* --- UPDATED: Shows the new descriptive loading message --- */}
                {isLoading && <Loader message={loadingMessage} />}

                {interpretation && (
                    <>
                        <div className="interpretation-box">
                            {interpretation}
                        </div>
                        <div className="post-reading-options">
                             <button className="memento-button" onClick={() => setShowMementoPage(true)}>
                                Create Memento
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

            {enlargedCard && (
                <div className="enlarged-card-overlay" onClick={() => setEnlargedCardId(null)}>
                    <div className="enlarged-card-modal">
                        <img src={enlargedCard.imageSrc} alt={enlargedCard.name} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default ReadingDisplayPage;