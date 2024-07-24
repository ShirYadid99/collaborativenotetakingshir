import React, { useState, useEffect, useContext } from 'react';
import { Container, ListGroup, Button, Row, Col, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebase-config';
import AuthContext from '../context/AuthContext';

function NotesList() {
    const { user } = useContext(AuthContext);
    const [notes, setNotes] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchNotes = async () => {
            if (user) {
                try {
                    const notesCollection = collection(db, 'notes');
                    const notesSnapshot = await getDocs(notesCollection);
                    const notesList = notesSnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    setNotes(notesList);
                } catch (error) {
                    setError('Error fetching notes');
                }
            }
        };
        fetchNotes();
    }, [user]);

    const handleDelete = async (id) => {
        if (user) {
            try {
                await deleteDoc(doc(db, 'notes', id));
                setNotes(notes.filter(note => note.id !== id));
            } catch (error) {
                console.error('Error deleting note:', error);
                setError('Error deleting note');
            }
        } else {
            setError('You must be signed in to delete notes.');
        }
    };

    return (
        <Container className="mt-5">
            <h2>All Notes</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <ListGroup>
                {notes.map(note => (
                    <ListGroup.Item key={note.id}>
                        <Row>
                            <Col>
                                <Link to={`/note-view/${note.id}`}>{note.title}</Link>
                            </Col>
                            <Col className="text-end">
                                <Button variant="primary" as={Link} to={`/edit-note/${note.id}`} className="me-2">
                                    Edit
                                </Button>
                                <Button variant="info" as={Link} to={`/note-history/${note.id}`} className="me-2">
                                    History
                                </Button>
                                <Button variant="danger" onClick={() => handleDelete(note.id)}>
                                    Delete
                                </Button>
                            </Col>
                        </Row>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </Container>
    );
}

export default NotesList;
