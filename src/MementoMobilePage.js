import React from 'react';

// This is the final, self-contained component for the mobile Memento.
// All styles are included, and it only requires the reading's text.
const MementoMobilePage = ({ mementoText, onBack }) => {

    return (
        <div style={styles.mementoPageBackground}>
            <div style={styles.mementoContainer}>
                {/* Stars and Mist for atmosphere */}
                <div style={{...styles.star, top: '15%', left: '20%', animationDelay: '0s', width: '3px', height: '3px'}}></div>
                <div style={{...styles.star, top: '25%', left: '80%', animationDelay: '1s', width: '2px', height: '2px'}}></div>
                <div style={{...styles.star, top: '60%', left: '10%', animationDelay: '2s', width: '4px', height: '4px'}}></div>
                <div style={{...styles.star, top: '85%', left: '50%', animationDelay: '0.5s', width: '2px', height: '2px'}}></div>
                <div style={{...styles.star, top: '50%', left: '90%', animationDelay: '1.5s', width: '3px', height: '3px'}}></div>
                <div style={styles.mist}></div>

                <div style={styles.branding}>
                    strangelreadings.com
                </div>

                <div style={styles.angelImageContainer}></div>

                <p style={styles.answerText}>
                    "{mementoText}"
                </p>
            </div>

            <div style={styles.mementoButtonsContainer}>
                <button style={styles.shareButton} onClick={() => alert('Sharing functionality to be added!')}>
                    Share Memento
                </button>
                <button style={styles.shareButton} onClick={onBack}>
                    Start New Reading
                </button>
            </div>
        </div>
    );
};

// --- Styles for the Mobile Memento ---
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
    },
    mementoContainer: {
        width: '90vw',
        height: '90vw',
        maxWidth: '500px',
        maxHeight: '500px',
        fontFamily: "'Cinzel', serif",
        color: '#fff',
        padding: '25px',
        boxSizing: 'border-box',
        borderRadius: '1rem',
        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#2d1a47',
    },
    angelImageContainer: {
        width: '55%',
        height: '55%',
        position: 'absolute',
        top: '45%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        borderRadius: '50%',
        border: '4px solid #1a0b2e',
        boxShadow: '0 0 20px 5px rgba(253, 224, 71, 0.5), 0 0 35px 10px rgba(253, 224, 71, 0.3)',
        backgroundImage: "url('https://images.squarespace-cdn.com/content/v1/63c124b461cb3504b7ab4e26/d8776412-80a8-48a1-8a38-26823eacaf50/IMG_5297.jpeg?format=1500w')",
        backgroundSize: '100%',
        backgroundPosition: 'center',
        zIndex: 5,
    },
    branding: {
        fontSize: '1.5rem',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        fontWeight: '700',
        textShadow: '0 2px 4px rgba(0,0,0,0.7)',
        zIndex: 10,
    },
    answerText: {
        fontFamily: "'Lora', serif",
        fontStyle: 'italic',
        fontSize: '1.2rem',
        lineHeight: 1.5,
        margin: 0,
        textShadow: '0 2px 4px rgba(0,0,0,0.7)',
        zIndex: 10,
        textAlign: 'center',
    },
    star: {
        position: 'absolute',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: '50%',
        boxShadow: '0 0 5px 2px rgba(255, 255, 255, 0.5)',
        animation: 'twinkle 4s infinite alternate',
        zIndex: 1,
    },
    mist: {
        position: 'absolute',
        bottom: '-50%',
        left: '-50%',
        width: '200%',
        height: '100%',
        background: 'radial-gradient(circle at center, rgba(168, 85, 247, 0.2) 0%, rgba(168, 85, 247, 0) 70%)',
        animation: 'drift 20s infinite linear alternate',
        zIndex: 2,
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
        padding: '0.75rem 1.5rem',
        borderRadius: '0.375rem',
        fontSize: '1rem',
        border: 'none',
    },
};

// Keyframes need to be added to the document's head
const keyframes = `
    @keyframes twinkle {
        0% { opacity: 0.4; transform: scale(0.8); }
        100% { opacity: 1; transform: scale(1.2); }
    }
    @keyframes drift {
        0% { transform: rotate(0deg) translateX(0); }
        100% { transform: rotate(360deg) translateX(10px); }
    }
`;

// Add keyframes to the document's head
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = keyframes;
document.head.appendChild(styleSheet);

export default MementoMobilePage;