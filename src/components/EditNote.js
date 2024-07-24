import React, { useState, useEffect, useContext } from 'react';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { doc, getDoc, updateDoc, addDoc, collection, getDocs } from 'firebase/firestore';
import { db } from './firebase-config';
import AuthContext from '../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';

function EditNote() {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [note, setNote] = useState({ title: '', content: '', category: '' });
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/signin');
            return;
        }

        const fetchNoteAndCategories = async () => {
            try {
                const noteDoc = doc(db, 'notes', id);
                const noteSnapshot = await getDoc(noteDoc);
                if (noteSnapshot.exists()) {
                    setNote(noteSnapshot.data());
                } else {
                    setError('Note not found');
                }

                const categoriesSnapshot = await getDocs(collection(db, 'categories'));
                const categoryList = categoriesSnapshot.docs.map(doc => doc.data().name);
                setCategories(categoryList);
            } catch (error) {
                setError('Error fetching data');
            } finally {
                setLoading(false);
            }
        };

        fetchNoteAndCategories();
    }, [id, user, navigate]);

    const saveChangeHistory = async (noteId, changedBy, change) => {
        try {
            await addDoc(collection(db, 'noteHistory'), {
                noteId,
                changedBy,
                date: new Date().toISOString(),
                change,
                title: note.title,
                content: note.content,
                category: note.category // Save the category
            });
        } catch (error) {
            console.error('Error saving change history:', error);
        }
    };

    const handleSave = async () => {
        if (user) {
            setLoading(true);
            try {
                const noteCategory = note.category === 'Add new category' ? newCategory : note.category;

                if (note.category === 'Add new category' && newCategory) {
                    await addDoc(collection(db, 'categories'), { name: newCategory });
                }

                const noteDoc = doc(db, 'notes', id);
                await updateDoc(noteDoc, {
                    title: note.title,
                    content: note.content,
                    category: noteCategory,
                    lastUpdated: new Date() // Optional: track when the note was last updated
                });

                // Save change history with title, content, and category
                await saveChangeHistory(id, user.email, 'Updated content and/or category');

                navigate('/notes');
            } catch (error) {
                console.error('Error updating note:', error);
                setError('Error updating note');
            } finally {
                setLoading(false);
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
                <Form.Group controlId="formNoteContent" className="mb-3">
                    <Form.Label>Note Content</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={6}
                        value={note.content}
                        onChange={(e) => setNote({ ...note, content: e.target.value })}
                    />
                </Form.Group>
                <Form.Group controlId="formNoteCategory" className="mb-3">
                    <Form.Label>Note Category</Form.Label>
                    <Form.Control
                        as="select"
                        value={note.category}
                        onChange={(e) => setNote({ ...note, category: e.target.value })}
                    >
                        <option value="">Select a category</option>
                        {categories.map((cat, index) => (
                            <option key={index} value={cat}>{cat}</option>
                        ))}
                        <option value="Add new category">Add new category</option>
                    </Form.Control>
                    {note.category === 'Add new category' && (
                        <Form.Control
                            type="text"
                            placeholder="Enter new category"
                            className="mt-2"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                        />
                    )}
                </Form.Group>
                <Button variant="primary" onClick={handleSave}>
                    Save
                </Button>
                <Button variant="secondary" onClick={() => navigate('/notes')} className="ms-2">
                    Back to List
                </Button>
            </Form>
        </Container>
    );
}

export default EditNote;
