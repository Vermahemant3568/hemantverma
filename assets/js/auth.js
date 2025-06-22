import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

console.log('auth.js script loaded');

const loginForm = document.getElementById('login-form');

if (loginForm) {
    console.log('Login form found.');
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('Login form submitted.');
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        console.log('Attempting to sign in with email:', email);

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                console.log('Sign-in successful for user:', user);
                window.location.href = 'dashboard.html';
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error('Sign-in error:', errorMessage);
                alert(`Error: ${errorMessage}`);
            });
    });
} else {
    console.error('Login form not found!');
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log('User is already signed in. Redirecting to dashboard.');
        // User is signed in, redirect to dashboard if they are on the login page.
        if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/admin/')) {
            window.location.href = 'dashboard.html';
        }
    } else {
        console.log('No user is signed in.');
    }
}); 