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
  Transaction.find({user: req.user._id}).populate("user").sort({$natural: -1}).limit(5)
    .then(transactionsFromDB => {
      res.render('wallet', {transactions: transactionsFromDB})
      console.log('hello')
      Transaction.find()
      .then(transactionsFromDB =>{
        let totalIncomes = 0;
        let totalExpenses = 0;

      })
    })
  
});

router.post("/transaction", (req, res, next) => {
    const { transaction, sign, tag } = req.body;
    const currentUser = req.session.user
  
    Transaction.create({
      transaction: transaction,
      tag: tag,
      sign: sign,
      user: currentUser
    
    })
   
    .then((createdTransaction) => {
      res.redirect("/wallet");
    });

   
  });







module.exports = router;