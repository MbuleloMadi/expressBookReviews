const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Check if the username is valid (exists in the users array)
const isValid = (username) => {
    const user = users.find((u) => u.username === username);
    return !!user;
}

// Check if the username and password match the records
const authenticatedUser = (username, password) => {
    const user = users.find((u) => u.username === username && u.password === password);
    return !!user;
}

// Only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;  
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }
    if (!isValid(username)) {
        return res.status(400).json({ message: "Invalid username" });
    }
    if (authenticatedUser(username, password)) {
        const token = jwt.sign({ username }, 'secretkey', { expiresIn: '1h' });
        res.status(200).json({ message: "Login successful", token });
    } else {
        res.status(401).json({ message: "Invalid username or password" });
    }
});

// Add or update a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const { review } = req.body;
    const token = req.headers['authorization'];
    
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    
    try {
        const decoded = jwt.verify(token, 'secretkey');
        const username = decoded.username;

        if (!isbn || !review) {
            return res.status(400).json({ message: "ISBN and review are required" });
        }

        if (!books[isbn]) {
            books[isbn] = { reviews: {} };
        }

        books[isbn].reviews[username] = review;
        res.status(200).json({ message: "Review added/updated successfully" });

    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, 'secretkey');
        const username = decoded.username;

        if (!isbn) {
            return res.status(400).json({ message: "ISBN is required" });
        }

        if (books[isbn] && books[isbn].reviews[username]) {
            delete books[isbn].reviews[username];
            res.status(200).json({ message: "Review deleted successfully" });
        } else {
            res.status(404).json({ message: "Review not found or not authorized to delete" });
        }

    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
