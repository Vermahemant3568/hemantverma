// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-storage.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAmzJIOQVlLkq1I_OoV84p7XXeGBwU0UW4",
    authDomain: "my-portfolio-1bafd.firebaseapp.com",
    projectId: "my-portfolio-1bafd",
    storageBucket: "my-portfolio-1bafd.appspot.com",
    messagingSenderId: "740216052432",
    appId: "1:740216052432:web:32ef59e3fc169d1fe15cd5",
    measurementId: "G-L18X2BKGPL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage }; 