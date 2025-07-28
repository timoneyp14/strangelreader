import React, { useState, useEffect } from 'react';
// Correctly import the database instance from your central firebase.js file
import { db } from './firebase'; // Make sure this path is correct!
import { collection, getDocs, onSnapshot, addDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import './GerrysJournalPage.css';

// --- Gerry's Journal Page Component ---
const GerrysJournalPage = ({ isAdmin }) => { // Receives isAdmin as a prop
    const [journalEntries, setJournalEntries] = useState([]);
    const [activeEntry, setActiveEntry] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState({ author: '', text: '' });
    const [isGerryPost, setIsGerryPost] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch journal entries from Firestore on component mount with cleanup
    useEffect(() => {
        let isMounted = true; // Flag to track if the component is mounted

        const fetchEntries = async () => {
            try {
                setLoading(true);
                const entriesCollection = collection(db, 'journal');
                const entrySnapshot = await getDocs(entriesCollection);
                const entriesList = entrySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                
                // Only update state if the component is still mounted
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
                // Only update state if the component is still mounted
                if (isMounted) {
                    setError("Could not load Gerry's journal. The connection to the celestial plane might be down.");
                    setLoading(false);
                }
            }
        };

        fetchEntries();

        // The cleanup function: this runs when the component unmounts
        return () => {
            isMounted = false;
        };
    }, []); // Empty dependency array ensures this runs only once on mount

    // Fetch comments for the active entry and listen for real-time updates
    useEffect(() => {
        if (!activeEntry) return;

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

        // This cleanup for the listener was already correct, which is good!
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

    if (loading) {
        return <div className="journal-page-wrapper"><div>Loading Gerry's thoughts...</div></div>;
    }
    
    if (error) {
        return <div className="journal-page-wrapper"><div style={{ padding: '2rem', color: 'red', textAlign: 'center' }}>{error}</div></div>;
    }

    return (
        <div className="journal-page-wrapper">
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
    );
};

export default GerrysJournalPage;