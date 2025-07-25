import React from 'react';

// Final version of the MementoPage component using the "Integrated Text" design.
function MementoPage({ readingCards, mementoText, onBack }) {

    if (!Array.isArray(readingCards) || readingCards.length < 4) {
        return (
            <div className="memento-page-background">
                <div className="memento-container">
                    <p className="answer-text" style={{color: '#422006'}}>Could not generate memento. Card data is missing.</p>
                    <button onClick={onBack} className="new-reading-button">
                        Start a New Reading
                    </button>
                </div>
            </div>
        );
    }

    const heroCard = readingCards[3];
    const backgroundCards = [readingCards[0], readingCards[1], readingCards[2]];

    const handleShare = async () => {
        const shareData = {
            title: 'My Strangel Reading',
            text: `I received a reading from Archangel Gerry! Here's the core wisdom: ${mementoText}`,
            url: window.location.href, 
        };
        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                alert("Right-click the memento to save the image, or copy the page link to share!");
            }
        } catch (err) {
            console.error("Share failed:", err);
            alert("Sharing failed. You can try saving the image instead.");
        }
    };

    return (
        <div className="memento-page-background">
            <div className="memento-container">
                <div className="branding">
                    StrangelReadings.com
                </div>

                <div className="card-display-area">
                    {/* Background Cards */}
                    {backgroundCards.map((card, index) => (
                        <div 
                            key={card.id} 
                            className={`card-wrapper background-card card-behind-${index + 1}`}
                        >
                            <img src={card.imageSrc} alt={card.name} />
                        </div>
                    ))}

                    {/* Hero Card */}
                    <div className="card-wrapper hero-card">
                        <img src={heroCard.imageSrc} alt={heroCard.name} />
                    </div>
                </div>

                <div className="answer-text-container">
                    <div className="answer-text">
                        Archangel Gerry says: {mementoText}
                    </div>
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