// src/components/NoteView.js
import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Form, Button } from 'react-bootstrap';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase-config';
import AuthContext from '../context/AuthContext';

function NoteView() {
    const { noteId } = useParams();
    const { user } = useContext(AuthContext);
    const [note, setNote] = useState({ title: '', content: '' });

    useEffect(() => {
        const fetchNote = async () => {
            if (user) {
                const noteDoc = doc(db, 'notes', noteId);
                const noteSnapshot = await getDoc(noteDoc);
                if (noteSnapshot.exists()) {
                    setNote(noteSnapshot.data());
                }
            }
        };
        fetchNote();
    }, [noteId, user]);

    const handleSave = async () => {
        if (user) {
            const noteDoc = doc(db, 'notes', noteId);
            await updateDoc(noteDoc, {
                title: note.title,
                content: note.content,
            });
        }
    };

    return (
        <Container className="mt-5">
            <h2>Edit Note</h2>
            <Form>
                <Form.Group controlId="formNoteTitle" className="mb-3">
                    <Form.Label>Note Title</Form.Label>
                    <Form.Control
                        type="text"
                        value={note.title}
                        onChange={(e) => setNote({ ...note, title: e.target.value })}
                    />
                </Form.Group>
                <Form.Group controlId="formNoteContent" className="mb-3">
                    <Form.Label>Note Content</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={note.content}
                        onChange={(e) => setNote({ ...note, content: e.target.value })}
                    />
                </Form.Group>
                <Button variant="primary" onClick={handleSave}>
                    Save
                </Button>
            </Form>
        </Container>
    );
}

export default NoteView;
