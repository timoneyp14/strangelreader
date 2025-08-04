import React, { useState, useEffect } from 'react';
import { db } from './firebase'; 
// --- UPDATED: 'where' is now imported from firestore ---
import { collection, getDocs, onSnapshot, addDoc, serverTimestamp, query, where, orderBy } from 'firebase/firestore';
// --- FIX: The CSS import has been moved to the correct position ---
import './GerrysJournalPage.css';

// --- NEW: Mystical Orb Loader Component ---
const Loader = () => (
    <div className="loader-container">
        <div className="orb-loader"></div>
        <p className="loading-message">Gerry is gathering his thoughts...</p>
    </div>
);

const GerrysJournalPage = ({ isAdmin }) => {
    const [journalEntries, setJournalEntries] = useState([]);
    const [activeEntry, setActiveEntry] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState({ author: '', text: '' });
    const [isGerryPost, setIsGerryPost] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- NEW: Component-specific styles for the orb loader and mobile layout ---
    const pageStyles = `
        .loader-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 50vh;
            text-align: center;
        }
        .loading-message {
            margin-top: 1rem;
            font-family: "Georgia", "Times New Roman", serif;
            font-size: 1.2rem;
            color: #581c87;
        }
        @keyframes pulse {
            0% {
                transform: scale(0.95);
                box-shadow: 0 0 0 0 rgba(168, 85, 247, 0.7);
            }
            70% {
                transform: scale(1);
                box-shadow: 0 0 0 15px rgba(168, 85, 247, 0);
            }
            100% {
                transform: scale(0.95);
                box-shadow: 0 0 0 0 rgba(168, 85, 247, 0);
            }
        }
        .orb-loader {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background-color: #a855f7; /* Purple orb color */
            animation: pulse 2s infinite;
        }

        /* --- FIX: Re-added mobile layout styles --- */
        @media (max-width: 768px) {
            .journal-page-wrapper .journal-entry-card, 
            .journal-page-wrapper .journal-archive-card, 
            .journal-page-wrapper .journal-comments-card {
                padding-left: 1.5rem;
                padding-right: 1.5rem;
            }

            .journal-page-wrapper .journal-wrapper {
                margin-left: 0.5rem;
                margin-right: 0.5rem;
                padding: 20px 1rem;
            }
        }
    `;

    useEffect(() => {
        let isMounted = true;
        const fetchEntries = async () => {
            try {
                setLoading(true);
                const entriesCollection = collection(db, 'journal');
                
                // The query now only fetches documents where 'isPublished' is true.
                const q = query(entriesCollection, where("isPublished", "==", true));
                
                const entrySnapshot = await getDocs(q);
                const entriesList = entrySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                
                if (isMounted) {
                    const sortedEntries = entriesList.sort((a, b) => a.order - b.order);
                    const reversedEntries = [...sortedEntries].reverse();
                    setJournalEntries(reversedEntries);
                    if (reversedEntries.length > 0) {
                        setActiveEntry(reversedEntries[0]);
                    }
                    setLoading(false);
                }
            } catch (e) {
                console.error("Error fetching entries:", e);
                if (isMounted) {
                    setError("Could not load Gerry's journal. The connection to the celestial plane might be down.");
                    setLoading(false);
                }
            }
        };
        fetchEntries();
        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        if (!activeEntry) return;
        const commentsCollection = collection(db, 'journal', activeEntry.id, 'comments');
        const q_comments = query(commentsCollection, orderBy('timestamp', 'asc'));
        const unsubscribe = onSnapshot(q_comments, (querySnapshot) => {
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

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.author.trim() || !newComment.text.trim() || !activeEntry) {
            console.warn("Comment submission blocked: all fields required.");
            return;
        }
        try {
            const commentsCollection = collection(db, 'journal', activeEntry.id, 'comments');
            await addDoc(commentsCollection, {
                author: newComment.author,
                text: newComment.text,
                isGerry: isAdmin && isGerryPost,
                timestamp: serverTimestamp()
            });
            setNewComment({ author: '', text: '' });
            setIsGerryPost(false);
        } catch (err) {
            console.error("Error adding comment:", err);
            setError("Sorry, your comment could not be posted. Please try again.");
        }
    };
    
    const archiveEntries = journalEntries.filter(entry => entry.id !== activeEntry?.id);

    // --- UPDATED: The loading state now shows the orb loader ---
    if (loading) {
        return (
            <>
                <style>{pageStyles}</style>
                <div className="journal-page-wrapper">
                    <Loader />
                </div>
            </>
        );
    }
    
    if (error) {
        return <div className="journal-page-wrapper"><div style={{ padding: '2rem', color: 'red', textAlign: 'center' }}>{error}</div></div>;
    }

    return (
        <>
            <style>{pageStyles}</style>
            <div className="journal-page-wrapper">
                <div className="journal-wrapper">
                    <h1 className="journal-main-title">From the Journal of Archangel Gerry</h1>
                    
                    {activeEntry && (
                        <>
                            <article className="journal-entry-card">
                                <div className="social-share-container">
                                    <button onClick={() => alert('Sharing to X!')} className="social-share-link">Share on X</button>
                                    <button onClick={() => alert('Sharing to Facebook!')} className="social-share-link">Share on Facebook</button>
                                    <button onClick={() => alert('Link copied!')} className="social-share-link">Copy Link</button>
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
            </div>
        </>
    );
};

export default GerrysJournalPage;
