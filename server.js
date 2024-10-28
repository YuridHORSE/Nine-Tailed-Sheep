import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get } from 'firebase/database';
import cors from 'cors'; // Import CORS

// Create __dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAH0zFBGTLw905tcXBtAX4NNoAC2qk0mxM",
    authDomain: "ninetailed-proj.firebaseapp.com",
    databaseURL: "https://ninetailed-proj-default-rtdb.firebaseio.com",
    projectId: "ninetailed-proj",
    storageBucket: "ninetailed-proj.appspot.com",
    messagingSenderId: "729521700154",
    appId: "1:729521700154:web:62578eba3a8abe083b2403"
};

// Initialize Firebase
initializeApp(firebaseConfig);
const db = getDatabase();

// Middleware
app.use(cors()); // Use CORS middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the login page when accessing the root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Handle signup
app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        await set(ref(db, 'user/' + username), {
            username,
            email,
            password
        });
        res.json({ message: 'Sign up successful!', user: { username, email } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Handle login
app.post('/login', async (req, res) => {
    console.log("Login attempt:", req.body); // Log incoming login data
    const { username, password } = req.body;
    const userRef = ref(db, 'user/' + username);

    try {
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
            const userData = snapshot.val();
            if (userData.password === password) {
                res.json({
                    success: true,
                    message: 'Login successful!',
                    user: { username }
                });
            } else {
                res.json({
                    success: false,
                    message: 'Incorrect password.'
                });
            }
        } else {
            res.json({
                success: false,
                message: 'User  does not exist. Please sign in first.'
            });
        }
    } catch (error) {
        console.error("Error during login:", error); // Log the error
        res.status(500).json({ error: error.message });
    }
});

// Fetch all users
app.get('/users', async (req, res) => {
    const usersRef = ref(db, 'user');
    try {
        const snapshot = await get(usersRef);
        if (snapshot.exists()) {
            const usersData = snapshot.val();
            const usersArray = Object.keys(usersData).map(key => usersData[key]);
            res.json(usersArray);
        } else {
            res.status(404).json({ message: 'No users found.' });
        }
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
