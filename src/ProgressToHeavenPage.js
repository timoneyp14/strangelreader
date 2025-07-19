import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';

// --- Component Definition ---
function ProgressToHeavenPage() {
    // --- State Management ---
    const [orbs, setOrbs] = useState([]);
    const [orbName, setOrbName] = useState('');
    const [orbColor, setOrbColor] = useState('#fde047');
    const [hasAwardedOrb, setHasAwardedOrb] = useState(sessionStorage.getItem('hasAwardedOrb') === 'true');
    const [db, setDb] = useState(null);
    const [userId, setUserId] = useState(null);
    const [appId, setAppId] = useState('default-app-id');
    const scrollerRef = useRef(null);

    // --- Data for Realms (CORRECTED TRIGGER VALUES) ---
    const REALMS = [
        { name: 'The Earthly Sky', trigger: 0, url: 'https://images.squarespace-cdn.com/content/v1/63c124b461cb3504b7ab4e26/e1efda68-76e6-4f2a-941c-e6904c821d42/realm-earth.jpg?format=1500w' },
        { name: 'The Realm Of Flying Friends', trigger: 200, url: 'https://images.squarespace-cdn.com/content/v1/63c124b461cb3504b7ab4e26/4ed640ce-fbfd-471b-9d41-8806d12f8fe4/IMG_5302.jpeg?format=1500w' },
        { name: 'The Murmuring Mangroves', trigger: 400, url: 'https://i.imgur.com/D45n2J5.png' },
        { name: 'The Plains of the Mooborus', trigger: 600, url: 'https://i.imgur.com/rDRx5g2.png' },
        { name: 'The Sea of Stillness', trigger: 800, url: 'https://i.imgur.com/pZ3gA8p.png' },
        { name: 'The Celestial Band Hall', trigger: 1000, url: 'https://i.imgur.com/L4yYf9C.png'}
    ];
    const REALM_HEIGHT = 2400;

    // --- Firebase Initialization and Data Fetching Effect ---
    useEffect(() => {
        let firebaseConfig = {};
        let finalAppId = 'default-app-id';
        let finalToken = null;

        if (process.env.REACT_APP_API_KEY) {
            firebaseConfig = {
                apiKey: process.env.REACT_APP_API_KEY,
                authDomain: process.env.REACT_APP_AUTH_DOMAIN,
                projectId: process.env.REACT_APP_PROJECT_ID,
                storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
                messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
                appId: process.env.REACT_APP_FIREBASE_APP_ID
            };
            finalAppId = process.env.REACT_APP_FIREBASE_APP_ID;
        } 
        else if (typeof window !== 'undefined' && window.__firebase_config) {
            try {
                firebaseConfig = JSON.parse(window.__firebase_config);
                finalAppId = window.__app_id || 'default-app-id';
                finalToken = window.__initial_auth_token || null;
            } catch (e) {
                console.error("Failed to parse window.__firebase_config", e);
                return;
            }
        }

        setAppId(finalAppId);

        if (firebaseConfig.apiKey) {
            const app = initializeApp(firebaseConfig);
            const firestore = getFirestore(app);
            const auth = getAuth(app);
            setDb(firestore);

            const authenticate = async () => {
                try {
                    if (finalToken) {
                        await signInWithCustomToken(auth, finalToken);
                    } else {
                        await signInAnonymously(auth);
                    }
                    setUserId(auth.currentUser?.uid || crypto.randomUUID());
                } catch (authError) {
                    console.error("Authentication failed:", authError);
                }
            };

            authenticate().then(() => {
                 const orbsCollectionRef = collection(firestore, `artifacts/${finalAppId}/public/data/orbs`);
                 const q = query(orbsCollectionRef, orderBy("timestamp", "asc"));

                 const unsubscribe = onSnapshot(q, (querySnapshot) => {
                     const orbsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                     setOrbs(orbsData);
                     if (scrollerRef.current) {
                         scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
                     }
                 }, (error) => {
                     console.error("Firebase onSnapshot error: ", error);
                 });

                 return () => unsubscribe();
            });
        } else {
            console.error("Firebase configuration is missing. Orb feature will not work.");
        }
    }, []);

    const handleOrbSubmit = async (e) => {
        e.preventDefault();
        if (!db) {
            alert("Database not connected. Cannot save orb.");
            return;
        }
        const name = orbName.trim() || "An unnamed light";
        try {
            const orbsCollectionRef = collection(db, `artifacts/${appId}/public/data/orbs`);
            await addDoc(orbsCollectionRef, {
                name,
                color: orbColor,
                timestamp: new Date(),
                userId
            });
            sessionStorage.setItem('hasAwardedOrb', 'true');
            setHasAwardedOrb(true);
            setOrbName('');
        } catch (error) {
            console.error("Error saving orb:", error);
            alert("Failed to add orb. Please try again.");
        }
    };

    const stepHeight = 80;
    const pathHeight = (orbs.length * stepHeight) + 300;
    let totalHeight = pathHeight;
    const visibleRealms = REALMS.filter(realm => orbs.length >= realm.trigger);
    visibleRealms.forEach(realm => {
        const realmBottomPosition = realm.trigger * stepHeight;
        const realmTopEdge = realmBottomPosition + REALM_HEIGHT;
        if (realmTopEdge > totalHeight) {
            totalHeight = realmTopEdge;
        }
    });
    
    let nextRealm = REALMS.find(realm => orbs.length < realm.trigger);

    let gerryTopPosition = totalHeight - 170; 
    if (orbs.length > 0) {
        const lastOrbTop = totalHeight - ((orbs.length - 1) * stepHeight) - 150;
        gerryTopPosition = lastOrbTop - 160; 
    }

    return (
        <div className="page-container progress-page">
            <div className="realm-scroller" ref={scrollerRef}>
                <div className="path-container" style={{ height: `${totalHeight}px` }}>
                    {[...Array(150)].map((_, i) => (
                        <div key={`star-${i}`} className="bg-star" style={{
                            width: `${Math.random() * 2 + 1}px`,
                            height: `${Math.random() * 2 + 1}px`,
                            top: `${Math.random() * totalHeight}px`,
                            left: `${Math.random() * 100}%`,
                            animationDuration: `${Math.random() * 5 + 3}s`,
                            animationDelay: `${Math.random() * 5}s`,
                        }}></div>
                    ))}
                     {[...Array(Math.floor(totalHeight / 1000))].map((_, i) => (
                        <div key={`nebula-${i}`} className="nebula" style={{
                            top: `${Math.random() * (totalHeight - 400)}px`,
                            left: `${Math.random() * 100 - 25}%`,
                            transform: `rotate(${Math.random() * 180}deg)`,
                        }}></div>
                    ))}
                    {visibleRealms.map(realm => (
                        <div 
                            key={realm.name} 
                            className="realm-background" 
                            style={{
                                '--realm-bg-image': `url(${realm.url})`,
                                bottom: `${realm.trigger * stepHeight}px`,
                                height: `${REALM_HEIGHT}px`,
                            }}
                        >
                            <h3 className="realm-title">{realm.name}</h3>
                        </div>
                    ))}
                    {orbs.map((orb, i) => (
                        <div key={orb.id} className="celestial-orb" style={{
                            top: `${totalHeight - (i * stepHeight) - 150}px`,
                            left: `${50 + Math.sin(i * 0.5) * 35}%`,
                            boxShadow: `0 0 15px 5px ${orb.color}`,
                        }}>
                            <span className="orb-tooltip">{orb.name}</span>
                        </div>
                    ))}
                    {nextRealm && (
                        <div className="next-realm-message" style={{ top: `${gerryTopPosition - 80}px` }}>
                            Next realm in {nextRealm.trigger - orbs.length} orbs...
                        </div>
                    )}
                    <div className="gerry-wrapper" style={{ top: `${gerryTopPosition}px` }}>
                        <div className="gerry-character-container">
                            <img src="https://images.squarespace-cdn.com/content/v1/63c124b461cb3504b7ab4e26/d8776412-80a8-48a1-8a38-26823eacaf50/IMG_5297.jpeg?format=1500w" alt="Archangel Gerry" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="progress-text-content">
                <h2>Gerry's Journey & Your Part In It</h2>
                <p>If you found your reading helpful, we ask that you spare a thought for the eternal soul of our dear friend, Archangel Gerry. As you know, Gerry is on a great journey of his own, and with each piece of wisdom he shares, he takes one step closer to his final reward.</p>
                <p>Every time a seeker like yourself finds their reading to be illuminating, you have the unique opportunity to aid Gerry on his ascent through the many strange and wonderful realms between Earth and Heaven.</p>
                <p>You can award Gerry an orb of light, a stepping stone of starlight that helps to build the very path he walks upon. To make your contribution truly personal, you may choose a colour for your orb and even bestow upon it a name, adding your own unique light to his journey towards salvation.</p>
                <div className="orb-counter-container">
                    Total Orbs on Gerry's Path: <span className="orb-count">{orbs.length}</span>
                </div>
                {hasAwardedOrb ? (
                    <div className="orb-awarded-message">
                        <h3>Gerry Thanks You For Your Orb</h3>
                    </div>
                ) : (
                    <div className="orb-contribution-container">
                        <h3>Bestow an Orb of Light</h3>
                        <form onSubmit={handleOrbSubmit}>
                            <div>
                                <label htmlFor="orb-name">Name your Light (optional)</label>
                                <input
                                    type="text"
                                    id="orb-name"
                                    value={orbName}
                                    onChange={(e) => setOrbName(e.target.value)}
                                    placeholder="e.g., Hope's Beacon"
                                />
                            </div>
                            <div>
                                <label htmlFor="orb-color">Choose a Color</label>
                                <input
                                    type="color"
                                    id="orb-color"
                                    value={orbColor}
                                    onChange={(e) => setOrbColor(e.target.value)}
                                />
                            </div>
                            <button type="submit">Add to Gerry's Path</button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProgressToHeavenPage;