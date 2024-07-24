// src/components/AddNote.js
import React, { useState, useContext } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase-config';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function AddNote() {
    const { user } = useContext(AuthContext);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSave = async () => {
        if (user) {
            try {
                await addDoc(collection(db, 'notes'), {
                    title: title,
                    content: content,
                    userId: user.uid, // Optional: To link the note to the user
                    createdAt: new Date()
                });
                navigate('/notes'); // Redirect to the notes list page
            } catch (error) {
                console.error('Error adding note:', error);
                setError('Error adding note. Please try again.');
            }
        } else {
            setError('You must be signed in to add notes.');
        }
    };

    return (
        <Container className="mt-5">
            <h2>Add New Note</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form>
                <Form.Group controlId="formNoteTitle" className="mb-3">
                    <Form.Label>Note Title</Form.Label>
                    <Form.Control
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId="formNoteContent" className="mb-3">
                    <Form.Label>Note Content</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </Form.Group>
                <Button variant="primary" onClick={handleSave}>
                    Save
                </Button>
            </Form>
        </Container>
    );
}

export default AddNote;
