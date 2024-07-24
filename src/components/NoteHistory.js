import React, { useState, useEffect, useContext } from 'react';
import { Container, ListGroup, Alert, Button, Spinner } from 'react-bootstrap';
import { collection, query, where, getDocs, doc, updateDoc, addDoc } from 'firebase/firestore';
import { db } from './firebase-config';
import AuthContext from '../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';

function NoteHistory() {
    const { id } = useParams(); // Note ID from URL
    const { user } = useContext(AuthContext);
    const [history, setHistory] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            if (user && id) {
                try {
                    const historyCollection = collection(db, 'noteHistory');
                    const q = query(historyCollection, where('noteId', '==', id));
                    const historySnapshot = await getDocs(q);
                    const historyList = historySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));

                    // Sort historyList by date
                    historyList.sort((a, b) => new Date(b.date) - new Date(a.date));

                    setHistory(historyList);
                } catch (error) {
                    setError('Error fetching history: ' + error.message);
                } finally {
                    setLoading(false);
                }
            } else {
                navigate('/signin'); // Redirect to sign-in page if not signed in
            }
        };

        fetchHistory();
    }, [id, user, navigate]);

    const handleRevert = async (entry) => {
        if (!window.confirm('Are you sure you want to revert to this version?')) {
            return;
        }

        if (user) {
            try {
                const noteDoc = doc(db, 'notes', id);

                // Verify historical entry contains necessary data
                if (!entry.content || !entry.category) {
                    setError('Historical entry does not contain necessary data');
                    return;
                }

                await updateDoc(noteDoc, {
                    content: entry.content, // Revert to historical content
                    category: entry.category, // Revert to historical category
                    lastUpdated: new Date() // Optional: track when the note was last updated
                });

                // Save a new history entry for the reversion
                await addDoc(collection(db, 'noteHistory'), {
                    noteId: id,
                    changedBy: user.email,
                    date: new Date().toISOString(),
                    change: 'Reverted to a previous version',
                    content: entry.content, // Save reverted content
                    category: entry.category // Save reverted category
                });

                navigate(`/notes`); // Redirect to the note view after successful reversion
            } catch (error) {
                console.error('Error reverting note:', error);
                setError('Error reverting note');
            }
        } else {
            setError('You must be signed in to revert notes.');
        }
    };

    if (loading) {
        return (
            <Container className="mt-5">
                <Spinner animation="border" />
                <span className="ms-2">Loading...</span>
            </Container>
        );
    }

    return (
        <Container className="mt-5">
            <h2>Note History</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Button variant="secondary" onClick={() => navigate('/notes')} className="mb-3">
                Back to List
            </Button>
            <ListGroup>
                {history.length > 0 ? (
                    history.map(entry => (
                        <ListGroup.Item key={entry.id}>
                            <p><strong>Changed By:</strong> {entry.changedBy}</p>
                            <p><strong>Date:</strong> {new Date(entry.date).toLocaleString()}</p>
                            <p><strong>Change:</strong> {entry.change}</p>
                            <p><strong>Category:</strong> {entry.category}</p>
                            <p><strong>Content:</strong> {entry.content}</p>
                            {/* Add a Revert Button */}
                            <Button variant="warning" onClick={() => handleRevert(entry)}>
                                Revert
                            </Button>
                        </ListGroup.Item>
                    ))
                ) : (
                    <ListGroup.Item>No history found.</ListGroup.Item>
                )}
            </ListGroup>
        </Container>
    );
}

export default NoteHistory;
