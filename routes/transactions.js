// routes/auth.routes.js

const { Router } = require("express");
const router = new Router();
const passport = require("passport");

// User and transaction models
const User = require("../models/User.model.js");
const Transaction = require("../models/Transaction.model.js");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

const isLoggedIn = require("./middlewareLoggedIn");

router.get("/wallet", isLoggedIn, (req, res) => {
  req.session.user = req.user;
  let total = 0;
  Transaction.find({ user: req.user._id }).then((transactionsFromDB) => {
    transactionsFromDB.forEach(function (trans) {
      if (trans.sign === "+") {
        total += trans.transaction;
      } else {
        total -= trans.transaction;
      }
      return total;
    });
    Transaction.find({ user: req.user._id })
      .populate("user")
      .sort({ $natural: -1 })
      .limit(5)
      .then((transactionsFromDB) => {
        res.render("wallet", {
          transactions: transactionsFromDB,
          result: total,
        });
      });
  });
})

router.get("/walletShowall", isLoggedIn, (req, res) => {
  req.session.user = req.user;
  let total = 0;
  Transaction.find({ user: req.user._id }).then((transactionsFromDB) => {
    transactionsFromDB.forEach(function (trans) {
      if (trans.sign === "+") {
        total += trans.transaction;
      } else {
        total -= trans.transaction;
      }
      return total;
    });
  Transaction.find({ user: req.user._id })
      .populate("user")
      .sort({ $natural: -1 })
      .then((transactionsFromDB) => {
        res.render("walletShowall", {
          transactions: transactionsFromDB,
          result: total
        });
      });
  });
})

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
