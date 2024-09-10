const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.get('/', function (req, res) {
    // Send all books in the response, formatted neatly using JSON.stringify
    res.send(JSON.stringify(books, null, 4));
  });
  

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function(req, res) {
    const isbn = req.params.isbn;
    for (let key in books) {
      if (key == isbn) {
        res.send(JSON.stringify(books[key], null, 4));
        return;
      }
    }
    res.status(404).send({ message: "Book not found" });
  });
  
// Get book details based on author
public_users.get('/author/:author', function(req, res) {
    const author = req.params.author;
    let result = {};
    for (let key in books) {
      if (books[key].author.toLowerCase() == author.toLowerCase()) {
        result[key] = books[key];
      }
    }
    if (Object.keys(result).length > 0) {
      res.send(JSON.stringify(result, null, 4));
    } else {
      res.status(404).send({ message: "No books found by this author" });
    }
  });

// Get all books based on title
public_users.get('/title/:title', function(req, res) {
    const title = req.params.title;
    let result = {};
    for (let key in books) {
      if (books[key].title.toLowerCase() == title.toLowerCase()) {
        result[key] = books[key];
      }
    }
    if (Object.keys(result).length > 0) {
      res.send(JSON.stringify(result, null, 4));
    } else {
      res.status(404).send({ message: "No books found with this title" });
    }
  });

//  Get book review
public_users.get('/review/:isbn', function(req, res) {
    const isbn = req.params.isbn;
    for (let key in books) {
      if (key == isbn) {
        res.send(JSON.stringify(books[key].reviews, null, 4));
        return;
      }
    }
    res.status(404).send({ message: "Book not found" });
  });

  public_users.post('/register', (req, res) => {
    const { username, password } = req.body;  // Retrieve username and password from the request body
  
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
  
    // Check if the user already exists
    const userExists = users.some(user => user.username === username);
  
    if (userExists) {
      return res.status(409).json({ message: "Username already exists" });
    }
  
    // Register the new user
    users.push({ username, password });
    res.status(200).json({ message: "User registered successfully" });
  });
  

module.exports.general = public_users;
