// src/components/HomePage.js
import React, { useContext } from 'react';
import { Container, Button } from 'react-bootstrap';
import AuthContext from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from './firebase-config'; // Correct the import path if needed
import { Link } from 'react-router-dom';

function HomePage() {
    const { user } = useContext(AuthContext);

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            // Optionally redirect to home page after signing out
            window.location.href = '/';
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <Container className="mt-5 text-center">
            {user ? (
                <>
                    <h2>Welcome back, {user.email}!</h2>
                    <div className="mt-4">
                        <Button variant="primary" as={Link} to="/notes" className="me-2">
                            View All Notes
                        </Button>
                        <Button variant="secondary" as={Link} to="/add-note">
                            Add New Note
                        </Button>
                    </div>
                    <Button variant="outline-danger" onClick={handleSignOut} className="mt-4">
                        Sign Out
                    </Button>
                </>
            ) : (
                <div>
                    <h2>Please Sign In or Sign Up</h2>
                    <Button variant="primary" as={Link} to="/signin" className="me-2">
                        Sign In
                    </Button>
                    <Button variant="secondary" as={Link} to="/signup">
                        Sign Up
                    </Button>
                </div>
            )}
        </Container>
    );
}

export default HomePage;
