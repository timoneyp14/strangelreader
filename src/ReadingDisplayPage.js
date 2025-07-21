import React, { useState } from 'react';

// A simple loader component
const Loader = () => <div className="loader"></div>;

function ReadingDisplayPage({ userQuery, selectedCards, cardData, setPage }) {
    const [interpretation, setInterpretation] = useState('');
    const [memento, setMemento] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [enlargedCard, setEnlargedCard] = useState(null);

    const readingCards = cardData.filter(card => selectedCards.includes(card.id));

    const handleCardClick = (cardId) => {
        setEnlargedCard(enlargedCard === cardId ? null : cardId);
    };

    const getInterpretation = async () => {
        setIsLoading(true);
        setInterpretation('');
        setMemento('');

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

        prompt += `\n\nAfter the main reading, on a new line, provide a single, unique sentence that encapsulates the core wisdom of this specific reading. Start this line with "Memento:"`;

        try {
            const response = await fetch("https://us-central1-strangelreadingslive.cloudfunctions.net/getReading", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
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
                setInterpretation("Gerry and Gemini seem to be in a deep consultation. Please try again in a moment.");
            }
        } catch (error) {
            console.error("Error calling function:", error);
            setInterpretation("It seems there was a disturbance in the cosmic connection. Please check your connection and try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const createMemento = () => {
        if (!memento) return;

        const cardImagesHTML = readingCards.map(card => `
            <div style="width: 200px; height: 300px; margin: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.2); border-radius: 1rem; overflow: hidden;">
                <img src="${card.imageSrc}" alt="${card.name}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
        `).join('');

        const mementoHTML = `
            <html><head><title>Your Strangel Reading Memento</title><style>
            body { font-family: "Georgia", "Times New Roman", serif; background-color: #FEF3C7; text-align: center; padding: 2rem; }
            h1 { color: #581c87; } .cards-container { display: flex; flex-wrap: wrap; justify-content: center; margin-top: 2rem; }
            .quote { font-style: italic; font-size: 1.25rem; margin-top: 2rem; color: #581c87; max-width: 600px; margin-left: auto; margin-right: auto; }
            .print-button { margin-top: 2rem; padding: 0.75rem 1.5rem; font-size: 1rem; color: white; background-color: #7e22ce; border: none; border-radius: 0.5rem; cursor: pointer; }
            @media print { .print-button { display: none; } }
            </style></head><body><h1>Your Strangel Reading</h1><div class="cards-container">${cardImagesHTML}</div>
            <p class="quote">"${memento}"</p><button class="print-button" onclick="window.print()">Print Memento</button></body></html>
        `;

        const newWindow = window.open("", "_blank");
        newWindow.document.write(mementoHTML);
        newWindow.document.close();
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
                            className={`reading-card ${enlargedCard === card.id ? 'enlarged' : ''}`}
                            onClick={() => handleCardClick(card.id)}
                        >
                            <img src={card.imageSrc} alt={card.name} />
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
                             <button className="memento-button" onClick={createMemento}>
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
