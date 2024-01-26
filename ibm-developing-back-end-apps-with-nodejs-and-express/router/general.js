const express = require('express');
let books = require("./booksdb.js");
const public_users = express.Router();

function getSimilarBooks(author, title) {
  const similarBooks = [];
  let isbn = 1;
  for (const book of Object.values(books)) { 
    if (book.author === author) {
      similarBooks.push({
        "isbn" : isbn,
        "title" : book.title,
        "reviews" : book.reviews
      });
    }
    if (book.title === title) {
      similarBooks.push({
        "isbn" : isbn,
        "author" : book.author,
        "reviews" : book.reviews
      });
    }
    isbn++;
  }

  return similarBooks;
}

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send({"books" : books});
});

public_users.get('/all', function (req, res) {
  new Promise((resolve, reject) => {
    resolve({"books" : books});
  })
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      // Handle any errors that occurred during the Promise chain
      console.error(error);
      res.status(500).send('An error occurred');
      reject(error);
    });
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];  
    if (book) {
      res.send(book);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
 });

 public_users.get('/isbn-2/:isbn',function (req, res) {
  new Promise((resolve, reject) => {
    const isbn = req.params.isbn;
    const book = books[isbn];  
    resolve(book);
  })
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      // Handle any errors that occurred during the Promise chain
      console.error(error);
      res.status(404).json({ message: 'Book not found' });
      reject(error);
    });
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let booksList = getSimilarBooks(author);
    if (booksList) {
      res.send({"booksbyauthor":booksList});
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
});

public_users.get('/author-2/:author',function  (req, res) {
  new Promise(async (resolve, reject) => {
    const author = req.params.author;
    let booksList = await getSimilarBooks(author);
     resolve({"booksbyauthor":booksList});
  })
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      // Handle any errors that occurred during the Promise chain
      console.error(error);
      res.status(404).json({ message: 'Book not found' });
      reject(error);
    });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let booksList = getSimilarBooks(null,title);
  if (booksList) {
    res.send({"booksbytitle":booksList});
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
});


public_users.get('/title-2/:title',function (req, res) {
  new Promise(async (resolve, reject) => {
    const title = req.params.title;
    let booksList = await getSimilarBooks(null,title);
     resolve({"booksbytitle":booksList});
  })
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      // Handle any errors that occurred during the Promise chain
      console.error(error);
      res.status(404).json({ message: 'Book not found' });
      reject(error);
    });
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];  
    if (book) {
      res.send(book.reviews);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
});

module.exports.general = public_users;
