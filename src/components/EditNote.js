import React, { useState, useEffect, useContext } from 'react';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { doc, getDoc, updateDoc, collection, addDoc } from 'firebase/firestore';
import { db } from './firebase-config';
import AuthContext from '../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';

function EditNote() {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [note, setNote] = useState({ title: '', content: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            // Redirect to sign-in page if not signed in
            navigate('/signin');
            return;
        }

        const fetchNote = async () => {
            try {
                const noteDoc = doc(db, 'notes', id);
                const noteSnapshot = await getDoc(noteDoc);
                if (noteSnapshot.exists()) {
                    setNote(noteSnapshot.data());
                } else {
                    setError('Note not found');
                }
            } catch (error) {
                setError('Error fetching note');
            } finally {
                setLoading(false);
            }
        };

        fetchNote();
    }, [id, user, navigate]);

    const saveChangeHistory = async (noteId, changedBy, change) => {
        try {
            await addDoc(collection(db, 'noteHistory'), {
                noteId,
                changedBy,
                date: new Date().toISOString(),
                change
            });
        } catch (error) {
            console.error('Error saving change history:', error);
        }
    };

    const handleSave = async () => {
        if (user) {
            try {
                const noteDoc = doc(db, 'notes', id);
                await updateDoc(noteDoc, {
                    title: note.title,
                    content: note.content,
                    lastUpdated: new Date() // Optional: track when the note was last updated
                });

                // Save change history
                await saveChangeHistory(id, user.email, 'Updated content');

                navigate('/notes');
            } catch (error) {
                console.error('Error updating note:', error);
                setError('Error updating note');
            }
        } else {
            setError('You must be signed in to edit notes.');
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
            <h2>Edit Note</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form>
                <Form.Group controlId="formNoteTitle" className="mb-3">
                    <Form.Label>Note Title</Form.Label>
                    <Form.Control
                        type="text"
                        value={note.title || ''}
                        onChange={(e) => setNote({ ...note, title: e.target.value })}
                    />
                </Form.Group>
                <Form.Group controlId="formNoteContent" className="mb-3">
                    <Form.Label>Note Content</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={6}
                        value={note.content || ''}
                        onChange={(e) => setNote({ ...note, content: e.target.value })}
                    />
                </Form.Group>
                <Button variant="primary" onClick={handleSave} className="me-2">
                    Save
                </Button>
                <Button variant="secondary" onClick={() => navigate('/notes')}>
                    Back to List
                </Button>
            </Form>
        </Container>
    );
}

export default EditNote;
