const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Middleware to parse JSON bodies
regd_users.use(express.json());

// Middleware to handle sessions
regd_users.use(session({
  secret: 'your_session_secret', // Replace with a secure secret
  resave: false,
  saveUninitialized: true,
}));

// Middleware to authenticate JWT and set req.user
const authenticateJWT = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (token) {
    jwt.verify(token, 'access_token_secret', (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// Check if the username exists in the users array
const isValid = (username) => {
  return users.some((user) => user.username === username);
};

// Check if the username and password match the one in records
const authenticatedUser = (username, password) => {
  return users.some(
    (user) => user.username === username && user.password === password
  );
};

// Register Route
regd_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (isValid(username)) {
    return res.status(409).json({ message: "Username is already taken" });
  }
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

// Login Route
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const token = jwt.sign({ username }, 'access_token_secret', { expiresIn: '1h' });
  req.session.token = token; // Store token in session if you need it
  return res.status(200).json({ message: "Login successful", token });
});

// Add/Update Review Route
regd_users.put("/auth/review/:isbn", authenticateJWT, (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;
  const username = req.user.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  books[isbn].reviews = books[isbn].reviews || {};
  books[isbn].reviews[username] = review;

  return res.status(200).json({ message: "Review added/updated successfully" });
});

// Delete Review Route
regd_users.delete("/auth/review/:isbn", authenticateJWT, (req, res) => {
  const { isbn } = req.params;
  const username = req.user.username;

  if (!books[isbn] || !books[isbn].reviews || !books[isbn].reviews[username]) {
    return res.status(404).json({ message: "Review not found" });
  }

  delete books[isbn].reviews[username];

  return res.status(200).json({ message: "Review deleted successfully" });
});

// Error Handling Middleware
regd_users.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
