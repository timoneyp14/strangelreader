import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';

// --- Component Definition ---
function AdminPage() {
    // --- State Management ---
    const [orbs, setOrbs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingOrb, setEditingOrb] = useState(null); // State to track which orb is being edited
    const [editText, setEditText] = useState(''); // State for the new name of the orb

    const [db, setDb] = useState(null);
    const [appId, setAppId] = useState('default-app-id');

    // --- Firebase Initialization and Data Fetching Effect ---
    useEffect(() => {
        let finalConfig = {};
        let finalAppId = 'default-app-id';

        if (process.env.REACT_APP_API_KEY) {
            finalConfig = {
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
                finalConfig = JSON.parse(window.__firebase_config);
                finalAppId = window.__app_id || 'default-app-id';
            } catch (e) {
                console.error("Failed to parse window.__firebase_config", e);
            }
        }
        
        setAppId(finalAppId);

        if (Object.keys(finalConfig).length > 0 && finalConfig.apiKey) {
            const app = initializeApp(finalConfig);
            const firestore = getFirestore(app);
            setDb(firestore);

            const orbsCollectionRef = collection(firestore, `artifacts/${finalAppId}/public/data/orbs`);
            const q = query(orbsCollectionRef, orderBy("timestamp", "desc"));

            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const orbsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setOrbs(orbsData);
                setIsLoading(false);
            }, (err) => {
                console.error("Firebase onSnapshot error: ", err);
                setError("Failed to fetch orbs. Check console for details.");
                setIsLoading(false);
            });

            return () => unsubscribe();
        } else {
            setError("Firebase configuration is missing.");
            setIsLoading(false);
        }
    }, []);

    // --- Handler Functions ---
    const handleDeleteOrb = async (orbId) => {
        if (!db) return;
        if (window.confirm("Are you sure you want to delete this orb?")) {
            const orbDocRef = doc(db, `artifacts/${appId}/public/data/orbs`, orbId);
            try {
                await deleteDoc(orbDocRef);
            } catch (err) {
                console.error("Error deleting orb:", err);
                alert("Failed to delete orb.");
            }
        }
    };

    const handleStartEdit = (orb) => {
        setEditingOrb(orb.id);
        setEditText(orb.name);
    };

    const handleUpdateOrb = async (orbId) => {
        if (!db || !editText.trim()) return;
        const orbDocRef = doc(db, `artifacts/${appId}/public/data/orbs`, orbId);
        try {
            await updateDoc(orbDocRef, {
                name: editText.trim()
            });
            setEditingOrb(null); // Exit editing mode
        } catch (err) {
            console.error("Error updating orb:", err);
            alert("Failed to update orb.");
        }
    };
    
    // --- JSX Rendering ---
    return (
        <div className="page-container admin-page">
            <header>
                <h1>Admin Panel</h1>
                <p>Manage the content of the Strangel Readings site.</p>
            </header>
            <main>
                <section className="admin-section">
                    <h2>Orb Moderation</h2>
                    {isLoading && <p>Loading orbs...</p>}
                    {error && <p className="error-message">{error}</p>}
                    <div className="orb-list">
                        {orbs.map(orb => (
                            <div key={orb.id} className="orb-item">
                                {editingOrb === orb.id ? (
                                    <div className="edit-form">
                                        <input 
                                            type="text" 
                                            value={editText} 
                                            onChange={(e) => setEditText(e.target.value)} 
                                        />
                                        <button onClick={() => handleUpdateOrb(orb.id)} className="save-btn">Save</button>
                                        <button onClick={() => setEditingOrb(null)} className="cancel-btn">Cancel</button>
                                    </div>
                                ) : (
                                    <div className="orb-details">
                                        <span className="orb-name">{orb.name}</span>
                                        <div className="orb-actions">
                                            <button onClick={() => handleStartEdit(orb)} className="edit-btn">Edit</button>
                                            <button onClick={() => handleDeleteOrb(orb.id)} className="delete-btn">Delete</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}

export default AdminPage;