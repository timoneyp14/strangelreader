import React from 'react';

function HomePage({ setPage }) {
  return (
    <div className="page-container">
      <header>
        {/* The H1 for "Strangel Readings" has been removed as it's in the main app header */}
        <h2>A Message from Archangel Gerry</h2>
      </header>
      <main>
        <p className="intro-text first-intro">
          Hello Seeker! Welcome to a space where intuition and innovation intertwine. With Archangel Gerry and Gemini
          unlock profound perspectives through the whimsical, sense-defying and deeply wise <span style={{fontWeight: 'bold'}}>A</span>nc<span style={{fontWeight: 'bold'}}>I</span>ent world of Strangel Cards.
        </p>
        <p className="intro-text">
            Touch or click on the deck to begin.
        </p>
        <div className="home-card-container">
            {/* This card now acts as the entry point to the Well of Wisdom */}
            <div className="card" onClick={() => setPage('well-of-wisdom')}>
                <img
                     src="https://images.squarespace-cdn.com/content/v1/63c124b461cb3504b7ab4e26/570bdf49-e945-41d5-9d2a-31292377d4c4/IMG_5264.jpeg?format=1500w"
                     alt="A single Strangel Card with an ethereal, abstract design"
                     className="card-image"/>
            </div>
        </div>
        {/* Subscription Box */}
        <div className="subscription-box">
            <h3>Receive Monthly Insights</h3>
            <p>
                Subscribe to Archangel Gerry's monthly email for exclusive wisdom, guidance, and updates from the Strangel world.
            </p>
            <form className="subscription-form">
                {/* The label has been removed as requested */}
                <input type="email" id="email-subscribe" name="email-subscribe"
                       placeholder="your@email.com" required />
                <button type="submit">Subscribe</button>
            </form>
        </div>
      </main>
    </div>
  );
}

export default HomePage;