// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

// Your web app's Firebase configuration
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
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Handle Sign Up and Log In
document.addEventListener('DOMContentLoaded', () => {
    const signupButton = document.getElementById("submit");
    const loginButton = document.getElementById("loginButton");
    const showUsersButton = document.getElementById('showUsersButton');

    // Sign Up
    if (signupButton) {
        signupButton.addEventListener('click', function(e) {
            e.preventDefault();

            const username = document.getElementById("username").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const confirmPassword = document.getElementById("confirmPassword").value;

            if (password !== confirmPassword) {
                alert("Passwords do not match. Please try again.");
                return;
            }

            fetch('/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                if (data.user) {
                    // Handle successful signup
                }
            })
            .catch(error => {
                alert("Error: " + error.message);
            });
        });
    }

    // Log In
    if (loginButton) {
        loginButton.addEventListener('click', function(e) {
            e.preventDefault();

            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("password").value.trim();

            fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                alert(data.message);
                if (data.success) {
                    window.location.href = "index.html";
                } else {
                    alert("Please sign in first.");
                }
            })
            .catch(error => {
                console.error("Fetch error:", error);
                alert("Error: " + error.message);
            });
        });
    }

    // Show Users functionality
    if (showUsersButton) {
        let isUserListVisible = false; // Track visibility state
    
        showUsersButton.addEventListener('click', async () => {
            if (!isUserListVisible) {
                await showUsers();
                showUsersButton.textContent = 'Hide Users'; // Change button text
            } else {
                const userListDiv = document.getElementById('userList');
                userListDiv.innerHTML = ''; // Clear the user list
                showUsersButton.textContent = 'Show Users'; // Change button text back
            }
            isUserListVisible = !isUserListVisible; // Toggle the state
        });
    
        async function showUsers() {
            try {
                // Get users from Firebase
                const dbRef = ref(db);
                const snapshot = await get(child(dbRef, 'user'));
                
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    // Convert the object to an array of users
                    const user = Object.values(userData);
                    displayUsers(user); // Pass user array to displayUsers
                } else {
                    console.log("No users found");
                    const userListDiv = document.getElementById('userList');
                    userListDiv.innerHTML = '<p>No users found</p>';
                }
            } catch (error) {
                console.error('Error fetching users:', error);
                const userListDiv = document.getElementById('userList');
                userListDiv.innerHTML = '<p>Error loading users</p>';
            }
        }
    
        function displayUsers(user) {
            const userListDiv = document.getElementById('userList');
            userListDiv.innerHTML = ''; // Clear previous users
            
            user.forEach(userItem => {
                const userDiv = document.createElement('div');
                userDiv.className = 'user-item';
                userDiv.textContent = `Username: ${userItem.username || 'N/A'}, Email: ${userItem.email || 'N/A'}`;
                userListDiv.appendChild(userDiv);
            });
        }
    }
    
});