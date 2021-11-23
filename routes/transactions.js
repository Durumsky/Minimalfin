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

router.get("/wallet", (req, res) => {
  if (!req.user) {
    res.redirect("/index"); // can't access the page, so go and log in
    return;
  }
  req.session.user = req.user
  // ok, req.user is defined
  Transaction.find().populate("user")
    .then(transactionsFromDB => {
      res.render('wallet', {transactions: transactionsFromDB})
    })
  
});

router.post("/transaction", (req, res, next) => {
    const { transaction, tag } = req.body;
    const currentUser = req.session.user

    console.log("the user:", currentUser)
  
    Transaction.create({
      transaction: transaction,
      tag: tag,
      user: currentUser._id
    
    }).then((createdTransaction) => {
      res.redirect(`/wallet`);
    });
  });







module.exports = router;