import React from 'react';
// We no longer need to import './MementoPage.css'

// --- All Styles are now defined inside the component file ---
const styles = {
    mementoPageBackground: {
        backgroundColor: '#e9d5ff',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        boxSizing: 'border-box',
        animation: 'dissolve-in 1s ease-in-out',
    },
    mementoContainer: {
        width: '90vw',
        height: '90vw',
        maxWidth: '600px',
        maxHeight: '600px',
        fontFamily: "'Cinzel', serif",
        color: '#44403c',
        padding: '15px 40px 40px',
        boxSizing: 'border-box',
        background: 'linear-gradient(135deg, #fde047, #f59e0b, #d97706)',
        borderRadius: '1rem',
        border: '3px solid #fde047',
        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2), inset 0 0 20px rgba(255, 255, 255, 0.3)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    branding: {
        // --- THE FIX IS HERE ---
        // More aggressive responsive font size for mobile.
        // Letter spacing is also reduced to save space.
        fontSize: 'clamp(1rem, 4.5vw, 2.2rem)',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        color: 'rgba(0, 0, 0, 0.6)',
        fontWeight: '700',
        zIndex: 30,
    },
    cardDisplayArea: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardWrapper: {
        position: 'absolute',
        boxShadow: '0 10px 35px rgba(0,0,0,0.3)',
        borderRadius: '1rem',
        overflow: 'hidden',
        border: '2px solid #fff',
    },
    heroCard: {
        width: '45%',
        aspectRatio: '2 / 3',
        zIndex: 10,
        transform: 'translateY(0) scale(1.05)',
    },
    backgroundCard: {
        width: '40%',
        aspectRatio: '2 / 3',
        zIndex: 5,
    },
    cardBehind1: { transform: 'translateY(-5%) translateX(-35%) rotate(-18deg)' },
    cardBehind2: { transform: 'translateY(-10%) rotate(0deg)' },
    cardBehind3: { transform: 'translateY(-5%) translateX(35%) rotate(18deg)' },
    answerTextContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 20,
        padding: '50px 25px 15px 25px', // Reduced side padding to make text wider
        background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 40%, transparent 100%)',
    },
    answerText: {
        fontFamily: "'Lora', serif",
        fontStyle: 'italic',
        // --- THE FIX IS HERE ---
        // More aggressive responsive font size for mobile.
        fontSize: 'clamp(0.9rem, 3.5vw, 1.8rem)',
        color: '#fff',
        lineHeight: 1.5,
        margin: '0 auto',
        textShadow: '0 2px 4px rgba(0,0,0,0.7)',
        textAlign: 'center',
    },
    mementoButtonsContainer: {
        display: 'flex',
        gap: '1rem',
        justifyContent: 'center',
        marginTop: '2rem',
    },
    shareButton: {
        fontFamily: "'Georgia', 'Times New Roman', serif",
        backgroundColor: '#6b21a8',
        color: 'white',
        fontWeight: 'bold',
        padding: '0.75rem 2rem',
        borderRadius: '0.375rem',
        fontSize: '1.1rem',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        border: 'none',
    },
    mementoPageError: {
        textAlign: 'center',
        padding: '2rem',
        color: '#4a148c',
    }
};

const MementoPage = ({ readingCards, mementoText, onBack }) => {
    if (!readingCards || readingCards.length < 4) {
        return (
            <div style={styles.mementoPageError}>
                <p>Sorry, there was an error creating the Memento. Please try again.</p>
                <button style={styles.shareButton} onClick={onBack}>Go Back</button>
            </div>
        );
    }

    const backgroundCards = readingCards.slice(0, 3);
    const heroCard = readingCards[3];

    return (
        <div style={styles.mementoPageBackground}>
            <div style={styles.mementoContainer}>
                <div style={styles.branding}>
                    strangelreadings.com
                </div>

                <div style={styles.cardDisplayArea}>
                    {backgroundCards.map((card, index) => (
                        <div key={card.id} style={{...styles.cardWrapper, ...styles.backgroundCard, ...styles[`cardBehind${index + 1}`]}}>
                            <img src={card.imageSrc} alt={card.name} style={{width: '100%', height: '100%', objectFit: 'cover'}}/>
                        </div>
                    ))}
                    
                    <div style={{...styles.cardWrapper, ...styles.heroCard}}>
                        <img src={heroCard.imageSrc} alt={heroCard.name} style={{width: '100%', height: '100%', objectFit: 'cover'}}/>
                    </div>
                </div>

                <div style={styles.answerTextContainer}>
                    <p style={styles.answerText}>
                        "{mementoText}"
                    </p>
                </div>
            </div>

            <div style={styles.mementoButtonsContainer}>
                <button style={styles.shareButton} onClick={() => alert('Sharing functionality to be added!')}>
                    Share Memento
                </button>
                <button style={styles.shareButton} onClick={onBack}>
                    Back to Reading
                </button>
            </div>
        </div>
    );
};

export default MementoPage;

