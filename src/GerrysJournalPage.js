import React, { useState, useEffect } from 'react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, getDocs, onSnapshot, addDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';

// IMPORTANT: You will need to replace this with your actual Firebase config object
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// --- Safer Firebase Initialization ---
const getFirebaseApp = () => {
  if (getApps().length > 0) {
    return getApp();
  } else {
    try {
      return initializeApp(firebaseConfig);
    } catch (error) {
      console.error("Firebase initialization failed:", error);
      return null;
    }
  }
};

const app = getFirebaseApp();
const db = app ? getFirestore(app) : null;


// --- Component to Inject CSS ---
const StyleInjector = () => (
  <style>{`
    /* --- Base Styles --- */
    body {
        font-family: "Georgia", "Times New Roman", serif;
        background-color: #e9d5ff;
        color: #333;
        margin: 0;
        padding: 0;
    }
    
    /* --- Main Wrapper & Title --- */
    .journal-wrapper {
        max-width: 800px;
        margin: 0 auto;
        padding: 1rem 0;
    }

    .journal-main-title {
        font-size: 2.8rem;
        color: #4a148c;
        font-weight: bold;
        text-align: center;
        margin-bottom: 2.5rem;
    }

    /* --- Entry & Archive Cards --- */
    .journal-entry-card, .journal-archive-card, .journal-comments-card {
        background-color: rgba(255, 255, 255, 0.7);
        border: 1px solid rgba(168, 85, 247, 0.2);
        border-radius: 12px;
        padding: 2rem 2.5rem;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
        margin-bottom: 3rem;
    }

    .journal-entry-card h2 {
        font-size: 2.2rem;
        color: #6a1b9a;
        font-weight: bold;
        margin-top: 0;
        margin-bottom: 1rem;
    }

    .journal-entry-content {
        color: #4a148c;
        font-size: 1.15rem;
        line-height: 1.8;
        text-align: left;
    }
    
    .journal-entry-content p {
        margin-bottom: 1.25em;
    }

    .journal-archive-card h3 {
        font-size: 1.75rem;
        color: #6a1b9a;
        font-weight: bold;
        text-align: center;
        margin-top: 0;
        margin-bottom: 2rem;
        border-bottom: 1px solid #e9d5ff;
        padding-bottom: 1rem;
    }

    .journal-archive-list { list-style: none; padding: 0; margin: 0; }
    .journal-archive-item { margin-bottom: 0.5rem; }

    .journal-archive-link {
        background: none; border: none; padding: 0.75rem 1rem;
        font-family: "Georgia", "Times New Roman", serif;
        font-size: 1.25rem; color: #581c87; cursor: pointer;
        width: 100%; text-align: left; border-radius: 8px;
        transition: background-color 0.2s, color 0.2s;
    }

    .journal-archive-link:hover { background-color: #e9d5ff; color: #4a148c; }
    
    /* --- Comment Section Styles --- */
    .journal-comments-card h3 {
        font-size: 1.75rem;
        color: #6a1b9a;
        font-weight: bold;
        text-align: center;
        margin-top: 0;
        margin-bottom: 2rem;
    }
    
    .comment-form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-bottom: 2.5rem;
        border-bottom: 1px solid #e9d5ff;
        padding-bottom: 2.5rem;
    }

    .comment-form input, .comment-form textarea {
        width: 100%;
        padding: 0.75rem 1rem;
        font-family: "Georgia", "Times New Roman", serif;
        font-size: 1rem;
        border: 1px solid #d8b4fe;
        border-radius: 8px;
        background-color: #faf5ff;
        box-sizing: border-box;
    }
    
    .comment-form textarea {
        min-height: 100px;
        resize: vertical;
    }
    
    .comment-form button {
        align-self: flex-start;
        background-color: #6a1b9a;
        color: #fff;
        font-family: "Georgia", "Times New Roman", serif;
        font-size: 1rem;
        font-weight: bold;
        padding: 0.7rem 1.5rem;
        border-radius: 50px;
        border: none;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .comment-form button:hover {
        background-color: #581c87;
        transform: translateY(-2px);
    }
    
    .admin-checkbox-container {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-top: 1rem;
        align-self: flex-start;
    }
    
    .admin-checkbox-container label {
        font-size: 0.9rem;
        color: #581c87;
    }

    .comments-list {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }
    
    .comment-item {
        background-color: #faf5ff;
        border: 1px solid #e9d5ff;
        border-radius: 8px;
        padding: 1rem 1.5rem;
        position: relative;
    }

    .comment-item.gerry-reply {
        background-color: #f3e8ff;
        border-color: #a855f7;
        box-shadow: 0 0 15px rgba(168, 85, 247, 0.2);
    }
    
    .comment-author {
        font-weight: bold;
        color: #581c87;
        margin-bottom: 0.5rem;
    }
    
    .comment-text {
        color: #4a148c;
        line-height: 1.6;
        margin: 0;
    }
    
    .comment-timestamp {
        font-size: 0.8rem;
        color: #9333ea;
        font-style: italic;
        position: absolute;
        top: 1rem;
        right: 1.5rem;
    }
    
    .no-comments-message {
        text-align: center;
        font-style: italic;
        color: #6a1b9a;
        padding: 2rem 0;
    }
    
    /* Social Share Styles */
    .social-share-container {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        margin-bottom: 1.5rem;
        font-size: 0.9rem;
    }
    
    .social-share-link {
        color: #6a1b9a;
        text-decoration: none;
        font-weight: bold;
        transition: color 0.2s ease;
    }
    
    .social-share-link:hover {
        color: #581c87;
        text-decoration: underline;
    }
  `}</style>
);

// --- Gerry's Journal Page Component ---
const GerrysJournalPage = ({ isAdmin }) => { // Receives isAdmin as a prop
    const [journalEntries, setJournalEntries] = useState([]);
    const [activeEntry, setActiveEntry] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState({ author: '', text: '' });
    const [isGerryPost, setIsGerryPost] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch journal entries from Firestore on component mount
    useEffect(() => {
        if (!db) {
            setError("Firebase is not configured correctly. Please check your firebaseConfig.");
            setLoading(false);
            return;
        }

        const fetchEntries = async () => {
            try {
                setLoading(true);
                const entriesCollection = collection(db, 'journal');
                const entrySnapshot = await getDocs(entriesCollection);
                const entriesList = entrySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                
                const sortedEntries = entriesList.sort((a, b) => a.order - b.order);
                const reversedEntries = [...sortedEntries].reverse();

                setJournalEntries(reversedEntries);
                if (reversedEntries.length > 0) {
                    setActiveEntry(reversedEntries[0]);
                }
                setLoading(false);
            } catch (e) {
                console.error("Error fetching entries:", e);
                setError("Could not load Gerry's journal. The connection to the celestial plane might be down.");
                setLoading(false);
            }
        };

        fetchEntries();
    }, []);

    // Fetch comments for the active entry and listen for real-time updates
    useEffect(() => {
        if (!activeEntry || !db) return;

        const commentsCollection = collection(db, 'journal', activeEntry.id, 'comments');
        const q = query(commentsCollection, orderBy('timestamp', 'asc'));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const commentsList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                timestamp: doc.data().timestamp?.toDate().toLocaleDateString("en-US", {
                    month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit'
                }) || 'a moment ago'
            }));
            setComments(commentsList);
        }, (err) => {
            console.error("Error fetching comments:", err);
            setError("Could not load comments for this entry.");
        });

        return () => unsubscribe();
    }, [activeEntry]);

    const handleEntrySelect = (entry) => {
        setActiveEntry(entry);
        window.scrollTo(0, 0);
    };

    const handleCommentChange = (e) => {
        const { name, value } = e.target;
        setNewComment(prev => ({ ...prev, [name]: value }));
    };

    // Handle submitting a new comment to Firestore
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.author.trim() || !newComment.text.trim() || !activeEntry) {
            alert("Please fill in all fields.");
            return;
        }

        try {
            const commentsCollection = collection(db, 'journal', activeEntry.id, 'comments');
            await addDoc(commentsCollection, {
                author: newComment.author,
                text: newComment.text,
                isGerry: isAdmin && isGerryPost, // Securely set based on admin status
                timestamp: serverTimestamp()
            });
            setNewComment({ author: '', text: '' });
            setIsGerryPost(false);
        } catch (err) {
            console.error("Error adding comment:", err);
            alert("Sorry, your comment could not be posted. Please try again.");
        }
    };
    
    const archiveEntries = journalEntries.filter(entry => entry.id !== activeEntry?.id);

    if (loading) {
        return <div>Loading Gerry's thoughts...</div>;
    }
    
    if (error) {
        return <div style={{ padding: '2rem', color: 'red', textAlign: 'center' }}>{error}</div>;
    }

    return (
        <>
            <StyleInjector />
            <div className="journal-wrapper">
                <h1 className="journal-main-title">From the Journal of Archangel Gerry</h1>
                
                {activeEntry && (
                    <>
                        <article className="journal-entry-card">
                            <div className="social-share-container">
                                <a href="#" className="social-share-link">Share on X</a>
                                <a href="#" className="social-share-link">Share on Facebook</a>
                                <a href="#" className="social-share-link">Copy Link</a>
                            </div>
                            <h2>{activeEntry.title}</h2>
                            <div 
                                className="journal-entry-content"
                                dangerouslySetInnerHTML={{ __html: activeEntry.content }} 
                            />
                        </article>

                        <section className="journal-comments-card">
                            <h3>Share Your Thoughts</h3>
                            <form className="comment-form" onSubmit={handleCommentSubmit}>
                                <input 
                                    type="text" 
                                    name="author"
                                    placeholder="Your Name" 
                                    value={newComment.author}
                                    onChange={handleCommentChange}
                                    required
                                />
                                <textarea 
                                    name="text"
                                    placeholder="Leave your comment here..."
                                    value={newComment.text}
                                    onChange={handleCommentChange}
                                    required
                                ></textarea>
                                
                                {/* This checkbox is now only rendered if isAdmin is true */}
                                {isAdmin && (
                                    <div className="admin-checkbox-container">
                                      <input 
                                        type="checkbox" 
                                        id="isGerryPost" 
                                        checked={isGerryPost} 
                                        onChange={(e) => setIsGerryPost(e.target.checked)} 
                                      />
                                      <label htmlFor="isGerryPost">Post as Archangel Gerry</label>
                                    </div>
                                )}

                                <button type="submit">Submit Comment</button>
                            </form>
                            
                            {comments.length > 0 ? (
                                <ul className="comments-list">
                                    {comments.map(comment => (
                                        <li key={comment.id} className={`comment-item ${comment.isGerry ? 'gerry-reply' : ''}`}>
                                            <span className="comment-timestamp">{comment.timestamp}</span>
                                            <p className="comment-author">{comment.author} says:</p>
                                            <p className="comment-text">{comment.text}</p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="no-comments-message">Be the first to share your thoughts with Gerry.</p>
                            )}
                        </section>
                    </>
                )}

                {archiveEntries.length > 0 && (
                    <section className="journal-archive-card">
                        <h3>Previous Entries</h3>
                        <ul className="journal-archive-list">
                            {archiveEntries.map(entry => (
                                <li key={entry.id} className="journal-archive-item">
                                    <button 
                                        className="journal-archive-link" 
                                        onClick={() => handleEntrySelect(entry)}
                                    >
                                        {entry.title}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}
            </div>
        </>
    );
};

export default GerrysJournalPage;