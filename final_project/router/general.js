const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!isValid(username)) {
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});
      }
    }
    return res.status(404).json({message: "Unable to register user."});
  });


// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    //res.send(JSON.stringify(books,null,4));
    const reqe = async () => books
    const mybooks = await reqe() 
    return res.status(200).json(mybooks)  
})



// Get book details based on ISBN
public_users.get('/isbn/:isbn/', async function (req, res) {
  const  isbn = req.params.isbn;
  const reqe = async (isbn) => books[isbn]
  const mybook = await reqe(isbn) 
  return res.status(200).json(mybook) 
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const author  = req.params.author ; 
    const reqe = async (author) => {
      for (const [key, mybook] of Object.entries(books)){
        if(mybook.author == author)
        return (mybook)
      }
    }
    const mybook = await reqe(author) 
    if (!mybook)
    return res.status(204);
    else
    return res.status(200).json(mybook) 
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  const  title = req.params.title;
  const reqe = async (title) => {
    for (const [key, mybook] of Object.entries(books)){
      if(mybook.title == title)
      return (mybook)
  }
} 
  const mybook = await reqe(title) 
  if (!mybook)
  return res.status(204);
  else
  return res.status(200).json(mybook)
  
});




//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const reviews = req.params.reviews;
  return res.status(200).json(books[isbn].reviews);
 });



module.exports.general = public_users;
