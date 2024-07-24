import React, { useState, useContext, useEffect } from 'react';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from './firebase-config';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function AddNote() {
    const { user } = useContext(AuthContext);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    const [newCategory, setNewCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'categories'));
                const categoryList = querySnapshot.docs.map(doc => doc.data().name);
                setCategories(categoryList);
            } catch (error) {
                setError('Error fetching categories');
            }
        };

        fetchCategories();
    }, []);

    const handleSave = async () => {
        if (user) {
            // Clear any previous error message
            setError('');

            // Check for empty fields
            if (!title || !content || !category || (category === 'Add new category' && !newCategory)) {
                setError('All fields are required.');
                return;
            }

            setLoading(true);
            try {
                const noteCategory = category === 'Add new category' ? newCategory : category;

                if (category === 'Add new category') {
                    await addDoc(collection(db, 'categories'), { name: newCategory });
                    setCategories([...categories, newCategory]); // Update local category list
                }

                // Add the note to the 'notes' collection
                const noteRef = await addDoc(collection(db, 'notes'), {
                    title: title,
                    content: content,
                    category: noteCategory, // Save category with the note
                    userId: user.uid, // Optional: To link the note to the user
                    createdAt: new Date()
                });

                // Add an entry to the 'noteHistory' collection
                await addDoc(collection(db, 'noteHistory'), {
                    noteId: noteRef.id, // ID of the newly created note
                    changedBy: user.email,
                    date: new Date().toISOString(),
                    change: 'Created new note',
                    title: title, // Save initial title
                    content: content, // Save initial content
                    category: noteCategory // Save initial category
                });

                navigate('/notes'); // Redirect to the notes list page
            } catch (error) {
                console.error('Error adding note:', error);
                setError('Error adding note. Please try again.');
            } finally {
                setLoading(false);
            }
        } else {
            setError('You must be signed in to add notes.');
            navigate('/signin'); // Redirect to the sign-in page if not signed in
        }
    };

    return (
        <Container className="mt-5">
            <h2>Add New Note</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {loading ? (
                <div className="d-flex justify-content-center mt-4">
                    <Spinner animation="border" />
                    <span className="ms-2">Saving...</span>
                </div>
            ) : (
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
                    <Form.Group controlId="formNoteCategory" className="mb-3">
                        <Form.Label>Note Category</Form.Label>
                        <Form.Control
                            as="select"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="">Select a category</option>
                            {categories.map((cat, index) => (
                                <option key={index} value={cat}>{cat}</option>
                            ))}
                            <option value="Add new category">Add new category</option>
                        </Form.Control>
                        {category === 'Add new category' && (
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
                </Form>
            )}
        </Container>
    );
}

export default AddNote;
