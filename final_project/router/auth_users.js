const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
     const user = users.find((u) => u.username === username);
    return !!user;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    const user = users.find((u) => u.username === username && u.password === password);
    return !!user;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
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
  return res.status(300).json({message: "Yet to be implemented"});
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
  return res.status(300).json({message: "Yet to be implemented"});
});

// Add a delete book review

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
