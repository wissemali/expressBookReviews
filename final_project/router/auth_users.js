const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
  let userswithsamename = users.filter((user)=>{
    return user.username === username
});
if(userswithsamename.length > 0){
  return true;
} else {
  return false;
}
}


const authenticatedUser = (username,password)=>{ 
   let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
 return validusers; 
}


//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({message: "Error logging in"});
    }
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', );
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).json( {"access Token": accessToken});
    } else {
      return res.status(401).json({message: "Invalid Login. Check username and password"});
    }
  });


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let review = req.query.review;
    let book = books[Number(isbn)]
    console.log("review==",review)
    books[Number(isbn)].reviews = review
    return res.status(200).json( `User with the isbn   ${isbn} updated.`);
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  books[Number(isbn)].reviews = {}
  return res.status(202).json( `User with the isbn   ${isbn} deleted.`);
});


   

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
