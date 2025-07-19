import React, { useState, useEffect } from 'react';
// Import the services from your new firebase.js file
import { auth, db, appId } from './firebase';
import { signInAnonymously } from 'firebase/auth';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';

function AdminPage() {
  // --- State Management ---
  const [orbs, setOrbs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingOrb, setEditingOrb] = useState(null);
  const [editText, setEditText] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // --- Firebase Data Fetching Effect ---
  useEffect(() => {
    const authenticate = async () => {
        try {
            await signInAnonymously(auth);
            setIsAuthenticated(true);

            // Now fetch the data using the imported 'db' and 'appId'
            const orbsCollectionRef = collection(db, `artifacts/${appId}/public/data/orbs`);
            const q = query(orbsCollectionRef, orderBy("timestamp", "desc"));

            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const orbsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setOrbs(orbsData);
                setIsLoading(false);
            }, (err) => {
                setError("Failed to fetch orbs.");
                setIsLoading(false);
            });

            return unsubscribe; // Return the unsubscribe function for cleanup

        } catch (authError) {
            console.error("Authentication failed:", authError);
            setError("Authentication failed. You may not be able to edit or delete orbs.");
            setIsLoading(false);
        }
    };

    const unsubscribePromise = authenticate();

    return () => {
        unsubscribePromise.then(unsubscribe => {
            if (unsubscribe) unsubscribe();
        });
    };
  }, []); 

  // --- Handler Functions ---
  const handleDeleteOrb = async (orbId) => {
    if (!db || !isAuthenticated) {
      alert("Authentication failed. Cannot delete orb.");
      return;
    }
    const orbDocRef = doc(db, `artifacts/${appId}/public/data/orbs`, orbId);
    try {
      await deleteDoc(orbDocRef);
    } catch (err) {
      alert("Failed to delete orb.");
    }
  };

  const handleStartEdit = (orb) => {
    setEditingOrb(orb.id);
    setEditText(orb.name);
  };

  const handleUpdateOrb = async (orbId) => {
    if (!db || !isAuthenticated || !editText.trim()) {
      alert("Authentication failed. Cannot update orb.");
      return;
    }
    const orbDocRef = doc(db, `artifacts/${appId}/public/data/orbs`, orbId);
    try {
      await updateDoc(orbDocRef, { name: editText.trim() });
      setEditingOrb(null);
    } catch (err) {
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