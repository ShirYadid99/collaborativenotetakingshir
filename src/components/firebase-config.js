// src/firebase-config.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD48GnZMx6SJjRhCSzFZfC3-k1GlWVIqWY",
    authDomain: "collaborativenotetakingshir.firebaseapp.com",
    projectId: "collaborativenotetakingshir",
    storageBucket: "collaborativenotetakingshir.appspot.com",
    messagingSenderId: "515072273912",
    appId: "1:515072273912:web:791b500e835c257725fa0d",
    measurementId: "G-P5CRNDHFSV"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

