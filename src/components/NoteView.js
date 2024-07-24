import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase-config';
import AuthContext from '../context/AuthContext';

function NoteView() {
    const { noteId } = useParams();
    const { user } = useContext(AuthContext);
    const [note, setNote] = useState({ title: '', content: '', category: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate(); // For navigation

    useEffect(() => {
        const fetchNote = async () => {
            if (user) {
                try {
                    const noteDoc = doc(db, 'notes', noteId);
                    const noteSnapshot = await getDoc(noteDoc);
                    if (noteSnapshot.exists()) {
                        setNote(noteSnapshot.data());
                    } else {
                        setError('No such document!');
                    }
                } catch (error) {
                    setError('Error fetching note: ' + error.message);
                } finally {
                    setLoading(false);
                }
            } else {
                navigate('/signin'); // Redirect to sign-in page if not authenticated
            }
        };
        fetchNote();
    }, [noteId, user, navigate]);

    const handleBackToList = () => {
        navigate('/notes'); // Navigate back to notes list
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
            <h2>View Note</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form>
                <Form.Group controlId="formNoteTitle" className="mb-3">
                    <Form.Label>Note Title</Form.Label>
                    <Form.Control
                        type="text"
                        value={note.title}
                        readOnly
                    />
                </Form.Group>
                <Form.Group controlId="formNoteContent" className="mb-3">
                    <Form.Label>Note Content</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={note.content}
                        readOnly
                    />
                </Form.Group>
                <Form.Group controlId="formNoteCategory" className="mb-3">
                    <Form.Label>Note Category</Form.Label>
                    <Form.Control
                        type="text"
                        value={note.category}
                        readOnly
                    />
                </Form.Group>
                <Button variant="secondary" onClick={handleBackToList}>
                    Back to List
                </Button>
            </Form>
        </Container>
    );
}

export default NoteView;
