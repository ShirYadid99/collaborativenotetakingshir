import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Form, Button } from 'react-bootstrap';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase-config';
import AuthContext from '../context/AuthContext';

function NoteView() {
    const { noteId } = useParams();
    const { user } = useContext(AuthContext);
    const [note, setNote] = useState({ title: '', content: '' });
    const navigate = useNavigate(); // For navigation

    useEffect(() => {
        const fetchNote = async () => {
            if (user && noteId) {
                try {
                    const noteDoc = doc(db, 'notes', noteId);
                    const noteSnapshot = await getDoc(noteDoc);
                    if (noteSnapshot.exists()) {
                        setNote(noteSnapshot.data());
                    } else {
                        console.error('No such document!');
                    }
                } catch (error) {
                    console.error('Error fetching note:', error);
                }
            }
        };
        fetchNote();
    }, [noteId, user]);

    const handleBackToList = () => {
        navigate('/notes'); // Update this to your actual route for the notes list
    };

    return (
        <Container className="mt-5">
            <h2>View Note</h2>
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
                <Button variant="secondary" onClick={handleBackToList}>
                    Back to List
                </Button>
            </Form>
        </Container>
    );
}

export default NoteView;
