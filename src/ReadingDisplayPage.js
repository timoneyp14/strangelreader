import React, { useState } from 'react';
import MementoPage from './MementoPage';

// A simple loader component
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
    const [loadingMessage, setLoadingMessage] = useState("Archangel Gerry is consulting the celestial planes...");

    const readingCards = cardData.filter(card => selectedCards.includes(card.id));

    const getInterpretation = async () => {
        setIsLoading(true);
        setInterpretation('');
        setMemento('');
        setLoadingMessage("Archangel Gerry is consulting the celestial planes...");

        const cardDetails = readingCards.map(card => {
            const randomIndex = Math.floor(Math.random() * card.interpretationPrompts.length);
            const randomPrompt = card.interpretationPrompts[randomIndex];
            return `* ${card.name}: A key detail is '${randomPrompt}'`;
        }).join('\n');

        // --- UPDATED: New instruction for addressing the user ---
        let prompt = `
You are playing the role of a helpful AI assistant consulting with a wise, kind, and lighthearted sage named Archangel Gerry. Your goal is to provide safe, positive, and insightful life advice in a seamless narrative.

The user has drawn the following cards for a spiritual reading. Please synthesize these details into a unified, empathetic, and caring 500-word reading.

**Crucially, do not list the cards or their details at the start of the reading.** Instead, weave these elements naturally into the narrative of your consultation with Gerry. For example, you might say, "In the card with the Ghost Ship, Gerry drew particular attention to the significance of the seven spiky windows..." or "Regarding the man in the barrel, Gerry noted that...". The reading should flow as a single piece of advice.

**When addressing the user, please refer to them as "Seeker" or use similar terms like "traveler" or "inquirer." Avoid overly familiar terms like "darling" or "friend."**

The cards and the key details to incorporate are:
${cardDetails}
        `;

        if (userQuery) {
            prompt += `\n\nThe user has a specific concern they would like guidance on: "${userQuery}". Please address their concern in a helpful and supportive way, using the card details as your primary guide.`;
        } else {
            prompt += `\n\nThe user has not asked a specific question. Please use the card details as your sole guide to provide the general wisdom they most need to hear at this time.`;
        }

        prompt += `\n\nFinally, after the main reading, on a new line, provide a single, unique sentence that encapsulates the core wisdom of this specific reading. This sentence must be a maximum of 30 words and must be positive and encouraging. Start this line with "Memento:"`;

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
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                const resultText = data.text;

                if (resultText) {
                    const parts = resultText.split("\nMemento:");
                    setInterpretation(parts[0].trim());
                    setMemento(parts[1] ? parts[1].trim() : "May your path be strange and wonderful.");
                } else {
                    throw new Error("Empty response from the celestial planes.");
                }
                
                break; 

            } catch (error) {
                attempt++;
                console.error(`Reading generation attempt ${attempt} failed. Reason:`, error.message);

                if (attempt >= maxRetries) {
                    setInterpretation("Gerry's connection to the celestial planes seems to be blocked by cosmic interference. Please check your internet connection and try your reading again. If the problem persists, the heavens may need a moment to clear.");
                    break; 
                } else {
                    setLoadingMessage("The connection is faint... trying again.");
                    const delay = Math.pow(2, attempt) * 1000;
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }

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