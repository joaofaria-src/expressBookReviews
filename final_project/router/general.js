const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
    // Check if the user does not already exist
    if (!isValid(username)) {
      // Add the new user to the users array
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  // Return error if username or password is missing
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const { isbn } = req.params; // Retrieve the ISBN from the request parameters
  // Check if the book exists in the 'books' object
  if (books[isbn]) {
    // Return the book details if found
    return res.status(200).json(books[isbn]);
  } else {
    // If the book is not found, return a 404 error
    return res.status(404).json({ message: "Book not found" });
  }
 });

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const { author } = req.params; // Retrieve the author name from the request parameters

  // Decode the author name if it is URL-encoded
  const decodedAuthor = decodeURIComponent(author);

  // Filter the books by the author's name
  const matchingBooks = Object.values(books).filter(book => book.author === decodedAuthor);

  if (matchingBooks.length > 0) {
    // Return the matching books
    return res.status(200).json(matchingBooks);
  } else {
    // If no books are found for the given author
    return res.status(404).json({ message: "No books found for the specified author" });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const { title } = req.params; // Retrieve the title from the request parameters

  // Decode the title if it is URL-encoded
  const decodedTitle = decodeURIComponent(title);

  // Find the book(s) matching the given title
  const matchingBooks = Object.values(books).filter(book => book.title.toLowerCase() === decodedTitle.toLowerCase());

  if (matchingBooks.length > 0) {
    // Return the matching books if found
    return res.status(200).json(matchingBooks);
  } else {
    // If no books are found with the given title
    return res.status(404).json({ message: "No books found with the specified title" });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const { isbn } = req.params; // Retrieve the ISBN from the request parameters

  // Check if the book exists in the books object
  if (books[isbn]) {
    // Return the reviews for the book
    return res.status(200).json(books[isbn].reviews);
  } else {
    // If no book is found for the given ISBN
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
