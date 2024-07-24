// src/components/NotesList.js
import React, { useState, useEffect, useContext } from 'react';
import { Container, ListGroup, Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase-config';
import AuthContext from '../context/AuthContext';

function NotesList() {
    const { user } = useContext(AuthContext);
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        const fetchNotes = async () => {
            if (user) {
                const notesCollection = collection(db, 'notes');
                const notesSnapshot = await getDocs(notesCollection);
                const notesList = notesSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setNotes(notesList);
            }
        };
        fetchNotes();
    }, [user]);

    return (
        <Container className="mt-5">
            <h2>All Notes</h2>
            <ListGroup>
                {notes.map(note => (
                    <ListGroup.Item key={note.id}>
                        <Row>
                            <Col>
                                <Link to={`/notes/${note.id}`}>{note.title}</Link>
                            </Col>
                            <Col className="text-end">
                                <Button variant="primary" as={Link} to={`/edit-note/${note.id}`} className="me-2">
                                    Edit
                                </Button>
                                <Button variant="info" as={Link} to={`/note-history/${note.id}`}>
                                    History
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
