// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import NotesList from './components/NoteList';

import { AuthProvider } from './context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavbarComponent from "./components/NavbarComp";
import NoteView from "./components/NoteView";
import AddNote from "./components/AddNote";

function App() {
    const [selectedNoteId, setSelectedNoteId] = useState(null);


    const handleNoteSaved = () => {
        setSelectedNoteId(null); // Reset selection after save
    };

    return (
        <AuthProvider>
            <Router>
                <NavbarComponent />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/notes" element={<NotesList />} />
                    <Route path="/notes/:noteId" element={<NoteView />} />
                    <Route path="/add-note" element={<AddNote />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;