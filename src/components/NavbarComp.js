// src/components/NavbarComp.js
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import AuthContext from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from './firebase-config'; // Ensure you have the correct path

const NavbarComponent = () => {
    const { user } = useContext(AuthContext); // Access user from context

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            // Optionally, redirect to home page after signing out
            window.location.href = '/';
        } catch (error) {
            console.error('Sign Out Error', error);
        }
    };

    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">Note-Taking App</Navbar.Brand>
                <Nav className="ml-auto">
                    {user ? (
                        <>
                            <Nav.Link as={Link} to="/notes">
                                Welcome, {user.email}
                            </Nav.Link>
                            <Button variant="outline-danger" onClick={handleSignOut}>
                                Sign Out
                            </Button>
                        </>
                    ) : (
                        <>
                            <Nav.Link as={Link} to="/signin">
                                Sign In
                            </Nav.Link>
                            <Nav.Link as={Link} to="/signup">
                                Sign Up
                            </Nav.Link>
                        </>
                    )}
                </Nav>
            </Container>
        </Navbar>
    );
};

export default NavbarComponent;
