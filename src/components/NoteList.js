import React, { useState, useEffect, useContext } from 'react';
import { Container, ListGroup, Button, Row, Col, Alert, Spinner, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebase-config';
import AuthContext from '../context/AuthContext';

function NotesList() {
    const { user } = useContext(AuthContext);
    const [notes, setNotes] = useState([]);
    const [filteredNotes, setFilteredNotes] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('');
    const navigate = useNavigate();

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
                    setFilteredNotes(notesList);
                } catch (error) {
                    setError('Error fetching notes');
                } finally {
                    setLoading(false);
                }
            } else {
                navigate('/signin'); // Redirect to sign-in page if not signed in
            }
        };

        fetchNotes();
    }, [user, navigate]);

    const handleDelete = async (id) => {
        if (user) {
            try {
                await deleteDoc(doc(db, 'notes', id));
                const updatedNotes = notes.filter(note => note.id !== id);
                setNotes(updatedNotes);
                setFilteredNotes(updatedNotes);
            } catch (error) {
                console.error('Error deleting note:', error);
                setError('Error deleting note');
            }
        } else {
            setError('You must be signed in to delete notes.');
        }
    };

    const handleCategoryChange = (e) => {
        const category = e.target.value;
        setSelectedCategory(category);

        if (category === 'All Categories') {
            setFilteredNotes(notes);
        } else {
            const filtered = notes.filter(note => note.category && note.category.toLowerCase() === category.toLowerCase());
            setFilteredNotes(filtered);
        }
    };

    // Extract unique categories for the dropdown
    const categories = [...new Set(notes.map(note => note.category))];

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
            <h2>All Notes</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form.Group className="mb-3">
                <Form.Label>Filter by Category</Form.Label>
                <Form.Control
                    as="select"
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                >
                    <option value="All Categories">All Categories</option>
                    {categories.map((category, index) => (
                        <option key={index} value={category}>
                            {category}
                        </option>
                    ))}
                </Form.Control>
            </Form.Group>
            {filteredNotes.length === 0 ? (
                <Alert variant="info">
                    No notes available. <Link to="/add-note">Add a new note</Link> to get started.
                </Alert>
            ) : (
                <ListGroup>
                    {filteredNotes.map(note => (
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
            )}
        </Container>
    );
}

export default NotesList;
