import React, { useState, useEffect, useContext } from 'react';
import { Container, ListGroup, Alert, Button, Spinner } from 'react-bootstrap';
import { collection, query, where, getDocs } from 'firebase/firestore';
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
