// src/components/Note.js
import React, { useState, useEffect, useContext } from 'react';
import { doc, setDoc, deleteDoc, getDoc, collection } from 'firebase/firestore';
import { db } from './firebase-config';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import AuthContext from '../context/AuthContext';

function Note({ noteId, onNoteSaved }) {
    const [note, setNote] = useState('');
    const [error, setError] = useState('');
    const { user } = useContext(AuthContext); // Get user from AuthContext

    useEffect(() => {
        if (noteId) {
            // Fetch note data if noteId is provided (for editing)
            const fetchNote = async () => {
                try {
                    const noteDoc = doc(db, 'notes', noteId);
                    const noteSnapshot = await getDoc(noteDoc);
                    if (noteSnapshot.exists()) {
                        setNote(noteSnapshot.data().content);
                    }
                } catch (err) {
                    setError('Error fetching note.');
                }
            };
            fetchNote();
        }
    }, [noteId]);

    const handleSave = async () => {
        if (!user) {
            setError('You must be signed in to add or edit notes.');
            return;
        }

        try {
            if (noteId) {
                // Update existing note
                await setDoc(doc(db, 'notes', noteId), { content: note });
            } else {
                // Create new note
                const newNoteRef = doc(collection(db, 'notes'));
                await setDoc(newNoteRef, { content: note });
            }
            onNoteSaved(); // Notify parent component
            setNote('');
        } catch (err) {
            setError('Error saving note.');
        }
    };

    const handleDelete = async () => {
        if (!user) {
            setError('You must be signed in to delete notes.');
            return;
        }

        try {
            if (noteId) {
                await deleteDoc(doc(db, 'notes', noteId));
                onNoteSaved(); // Notify parent component
                setNote('');
            }
        } catch (err) {
            setError('Error deleting note.');
        }
    };

    return (
        <Container className="mt-5">
            <h2 className="mb-4">{noteId ? 'Edit Note' : 'Create Note'}</h2>
            <Form>
                <Form.Group controlId="formNoteContent" className="mb-3">
                    <Form.Label>Note Content</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                    />
                </Form.Group>
                <Button variant="primary" onClick={handleSave}>
                    Save
                </Button>
                {noteId && (
                    <Button variant="danger" onClick={handleDelete} className="ms-2">
                        Delete
                    </Button>
                )}
                {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
            </Form>
        </Container>
    );
}

export default Note;
