const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
  // Check if the username is valid (not empty and not null)
  return username !== null && username !== '';
}

const authenticatedUser = (username,password)=>{ 
  // Check if the username and password match the one we have in records
  for (let i = 0; i < users.length; i++) {
    if (users[i].username === username && users[i].password === password) {
      return true;
    }
  }
  return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
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

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const { review } = req.body;
  if (!isbn || !review) {
    return res.status(400).json({ message: "ISBN and review are required" });
  }
  for (let key in books) {
    if (key == isbn) {
      books[key].reviews = review;
      res.status(200).json({ message: "Review added successfully" });
      return;
    }
  }
  res.status(404).send({ message: "Book not found" });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  if (!isbn) {
    return res.status(400).json({ message: "ISBN is required" });
  }
  for (let key in books) {
    if (key == isbn) {
      delete books[key].reviews;
      res.status(200).json({ message: "Review deleted successfully" });
      return;
    }
  }
  res.status(404).send({ message: "Book not found" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;