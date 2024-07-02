// Import the necessary functions from the Firebase SDKs
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC2RoCXk8DgXtbJ-GIMigCYUOOE0jBaGp8",
    authDomain: "shutter-vault-react.firebaseapp.com",
    projectId: "shutter-vault-react",
    storageBucket: "shutter-vault-react.appspot.com",
    messagingSenderId: "358828458742",
    appId: "1:358828458742:web:d242adacc3f123e07b62d7",
    measurementId: "G-2R221C8BGK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore, Auth, and Storage
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };
