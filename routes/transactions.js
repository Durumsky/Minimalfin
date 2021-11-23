// routes/auth.routes.js

const { Router } = require("express");
const router = new Router();
const passport = require("passport");

// User model
const User = require("../models/User.model.js");
const Transaction = require("../models/Transaction.model.js");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

const isLoggedIn = require("./middlewareLoggedIn");

router.get("/wallet", isLoggedIn, (req, res) => {
  req.session.user = req.user
  console.log('hola')
  
  
  // ok, req.user is defined
  Transaction.find({user: req.user._id}).populate("user")
    .then(transactionsFromDB => {
      res.render('wallet', {transactions: transactionsFromDB})
      console.log('hello')
    })
  
});

router.post("/transaction", (req, res, next) => {
    const { transaction, tag } = req.body;
    const currentUser = req.session.user
  
    Transaction.create({
      transaction: transaction,
      tag: tag,
      user: currentUser
    
    })
   
    .then((createdTransaction) => {
      res.redirect("/wallet");
    });

   
  });







module.exports = router;