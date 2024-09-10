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

const axios = require('axios');

const getBooks = async () => {
    try {
        const response = await axios.get('http://localhost:3000');
        console.log('List of books:', response.data);
    } catch (error) {
        console.error('Error fetching the list of books:', error);
    }
};

getBooks();


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

  const axios = require('axios');

const getBookByISBN = async (isbn) => {
    try {
        const response = await axios.get(`http://localhost:3000/isbn/${isbn}`);
        console.log('Book details:', response.data);
    } catch (error) {
        console.error(`Error fetching book with ISBN ${isbn}:`, error);
    }
};

// Replace '1234567890' with actual ISBN
getBookByISBN('1234567890');

  
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


  const axios = require('axios');

const getBooksByAuthor = async (author) => {
    try {
        const response = await axios.get(`http://localhost:3000/author/${author}`);
        console.log('Books by author:', response.data);
    } catch (error) {
        console.error(`Error fetching books by author ${author}:`, error);
    }
};

// Replace 'John Doe' with actual author name
getBooksByAuthor('John Doe');



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

  const axios = require('axios');

const getBooksByTitle = async (title) => {
    try {
        const response = await axios.get(`http://localhost:3000/title/${title}`);
        console.log('Books by title:', response.data);
    } catch (error) {
        console.error(`Error fetching books with title ${title}:`, error);
    }
};

const axios = require('axios');

const getBooksByTitle = async (title) => {
    try {
        const response = await axios.get(`http://localhost:3000/title/${title}`);
        console.log('Books by title:', response.data);
    } catch (error) {
        console.error(`Error fetching books with title ${title}:`, error);
    }
};

// Replace 'The Great Book' with actual book title
getBooksByTitle('The Great Book');


// Replace 'The Great Book' with actual book title
getBooksByTitle('The Great Book');


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
