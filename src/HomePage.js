import React, { useState } from 'react';
import SubscribeForm from './SubscribeForm'; // Import the new form component

function HomePage({ setPage }) {
  const [isFadingOut, setIsFadingOut] = useState(false);

  const handleStartReading = () => {
    setIsFadingOut(true);
    // Updated timeout to match the 4-second CSS animation
    setTimeout(() => {
      setPage('well-of-wisdom');
    }, 4000); 
  };

  return (
    <div className={`page-container ${isFadingOut ? 'dissolving-out' : ''}`}>
      <header>
        <h2>A Message from Archangel Gerry</h2>
      </header>
      <main>
        <p className="intro-text first-intro">
          Hello Seeker! Welcome to a space where intuition and innovation intertwine.
          <br />
          With Archangel Gerry and Gemini, unlock profound perspectives through the whimsical, sense-defying and deeply wise <span style={{fontWeight: 'bold'}}>A</span>nc<span style={{fontWeight: 'bold'}}>I</span>ent world of Strangel Cards.
        </p>
        <p className="intro-text">
            Touch or click on the deck to begin.
        </p>
        <div className="home-card-container">
            <div className="card" onClick={handleStartReading}>
                <img
                     src="https://images.squarespace-cdn.com/content/v1/63c124b461cb3504b7ab4e26/570bdf49-e945-41d5-9d2a-31292377d4c4/IMG_5264.jpeg?format=1500w"
                     alt="A single Strangel Card with an ethereal, abstract design"
                     className="card-image"/>
            </div>
        </div>
        <div className="subscription-box">
            <h3>Receive Monthly Insights</h3>
            <p>
                Subscribe to Archangel Gerry's monthly email for exclusive wisdom, guidance, and updates from the Strangel world.
            </p>
            {/* --- This is the new, working form component --- */}
            <SubscribeForm />
        </div>
      </main>
    </div>
  );
}
export default HomePage;