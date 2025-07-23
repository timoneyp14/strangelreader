import React from 'react';

// This is a new, self-contained component for our memento.
function MementoPage({ readingCards, mementoText, onBack }) {

    // The 4th card drawn is the Hero Card.
    const heroCard = readingCards[3];
    const thumbnailCards = [readingCards[0], readingCards[1], readingCards[2]];

    // This function will allow the user to use their browser's native share functionality.
    const handleShare = async () => {
        const shareData = {
            title: 'My Strangel Reading',
            text: `I received a reading from Archangel Gerry! Here's the core wisdom: ${mementoText}`,
            url: 'https://strangelreadings.com', // Replace with your actual domain when live
        };
        try {
            await navigator.share(shareData);
        } catch (err) {
            console.error("Share failed:", err);
            // Fallback for browsers that don't support navigator.share
            // For now, we'll just log it. We could add a "copy link" feature here later.
            alert("Sharing is not supported on this browser, but you can copy the link!");
        }
    };

    return (
        <div className="memento-page-background">
            <div className="memento-container">
                <div className="card-display-area">
                    <div className="hero-card-wrapper">
                        <img src={heroCard.imageSrc} alt={heroCard.name} />
                    </div>
                    <div className="thumbnail-container">
                        {thumbnailCards.map(card => (
                            <div key={card.id} className="thumbnail-card-wrapper">
                                <img src={card.imageSrc} alt={card.name} />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="answer-text">
                    Archangel Gerry says: {mementoText}
                </div>
                <div className="branding">
                    StrangelReadings.com
                </div>
            </div>
            <div className="memento-buttons-container">
                <button onClick={handleShare} className="share-button">
                    Share Memento
                </button>
                 <button onClick={onBack} className="new-reading-button">
                    Start a New Reading
                </button>
            </div>
        </div>
    );
}

export default MementoPage;
