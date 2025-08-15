document.addEventListener('DOMContentLoaded', () => {
    const firebaseConfig = {
        apiKey: "AIzaSyAtoOl7HrYpdZQqZsHzrJn4Urcfp4IDLko",
        authDomain: "onlinesystem-72eb5.firebaseapp.com",
        projectId: "onlinesystem-72eb5",
        storageBucket: "onlinesystem-72eb5.firebasestorage.app",
        messagingSenderId: "436376296755",
        appId: "1:436376296755:web:c05f266d69935062b9f246",
        measurementId: "G-NES6GHH2ZX"
    };

    try {
        firebase.initializeApp(firebaseConfig);
    } catch (e) {
        console.error("Firebase initialization error:", e);
        return; // Stop execution if Firebase fails to initialize
    }
    
    const auth = firebase.auth();

    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginButton = document.getElementById('loginButton');
    const spinner = loginButton.querySelector('.spinner-border');
    const errorMessage = document.getElementById('error-message');

    if (!loginForm) {
        // This script is not on the login page, so do nothing.
        return;
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = emailInput.value;
        const password = passwordInput.value;

        spinner.classList.remove('d-none');
        loginButton.disabled = true;
        errorMessage.classList.add('d-none');

        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                window.location.href = 'dashboard.html';
            })
            .catch((error) => {
                const errorCode = error.code;
                let userMessage = 'هەڵەیەک ڕوویدا، تکایە دووبارە هەوڵبدەرەوە.';

                if (errorCode === 'auth/user-not-found') {
                    userMessage = 'ئەم بەکارهێنەرە بوونی نییە. تکایە دڵنیابە لە ئیمەیڵەکەت.';
                } else if (errorCode === 'auth/wrong-password') {
                    userMessage = 'وشەی نهێنی هەڵەیە. تکایە دووبارە تاقی بکەرەوە.';
                } else if (errorCode === 'auth/invalid-email') {
                    userMessage = 'فۆرماتی ئیمەیڵەکەت هەڵەیە.';
                }
                
                console.error("Firebase Auth Error:", error.code, error.message);
                errorMessage.textContent = userMessage;
                errorMessage.classList.remove('d-none');
            })
            .finally(() => {
                spinner.classList.add('d-none');
                loginButton.disabled = false;
            });
    });
});
