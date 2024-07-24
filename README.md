# Collaborative Note Taking App

## Shir Yadid: shiryad@edu.hac.ac.il


This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and integrates Firebase for backend services.

## Getting Started

### Prerequisites

Make sure you have the following installed:
- Node.js and npm
- Firebase account and a configured Firebase project

### Installation

1. Clone the repository:
    ```bash
    git clone <repository-url>
    ```

2. Navigate to the project directory:
    ```bash
    cd <project-directory>
    ```

3. Install dependencies:
    ```bash
    npm install
    ```

4. Create a `.env` file in the root directory and add your Firebase configuration:
    ```env
    REACT_APP_FIREBASE_API_KEY=<your-api-key>
    REACT_APP_FIREBASE_AUTH_DOMAIN=<your-auth-domain>
    REACT_APP_FIREBASE_PROJECT_ID=<your-project-id>
    REACT_APP_FIREBASE_STORAGE_BUCKET=<your-storage-bucket>
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID=<your-messaging-sender-id>
    REACT_APP_FIREBASE_APP_ID=<your-app-id>
    ```

5. Start the development server:
    ```bash
    npm start
    ```
   Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in development mode.\
The page will reload when you make changes.\
You may also see any lint errors in the console.


## Features

- **Authentication**: Sign up, sign in, and manage user sessions with Firebase Authentication.
- **CRUD Operations**: Create, read, update, and delete notes using Firebase Firestore.
- **Note History**: Track changes to notes and view history with Firebase Firestore.
- **Responsive Design**: Built with React Bootstrap for a responsive and user-friendly interface.

## Firebase Integration

- **Firebase Configuration**: Set up your Firebase project and configure it in the `.env` file.
- **Firestore**: Use Firestore for storing and retrieving notes and their history.
- **Authentication**: Handle user authentication with Firebase Auth.

