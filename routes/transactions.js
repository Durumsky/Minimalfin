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

  let groceriesTotal = 0;
  let restaurantTotal = 0;
  let goingOutTotal = 0;
  let shoppingTotal = 0;
  let transportationTotal = 0;
  let homeTotal = 0;
  let healthTotal = 0;
  let sportTotal = 0;
  let subscriptionsTotal = 0;
  let otherTotal = 0

  Transaction.find({ user: req.user._id }).then((transactionsFromDB) => {
    transactionsFromDB.forEach(function (trans) {
        total += trans.transaction;
  
      if (trans.tag === 'groceries'){
        groceriesTotal += trans.transaction;
      }

      if (trans.tag === 'restaurant') {
        restaurantTotal += trans.transaction;
      }

      if (trans.tag === 'going-out') {
        goingOutTotal += trans.transaction;
      } 

      if (trans.tag === 'shopping') {
        shoppingTotal += trans.transaction;
      }

      if (trans.tag === 'transportation') {
        transportationTotal += trans.transaction;
      }

      if (trans.tag === 'home') {
        homeTotal += trans.transaction;
      }

      if (trans.tag === 'health') {
        healthTotal += trans.transaction;
      }

      if (trans.tag === 'sport') {
        sportTotal += trans.transaction;
      }

      if (trans.tag === 'subscriptions') {
        subscriptionsTotal += trans.transaction;
      }

      if (trans.tag === 'other') {
        otherTotal += trans.transaction;
      }

      console.log(total, groceriesTotal, restaurantTotal, goingOutTotal, shoppingTotal, transportationTotal,  homeTotal, healthTotal, sportTotal, subscriptionsTotal, otherTotal)

      return total, groceriesTotal, restaurantTotal, goingOutTotal, shoppingTotal, transportationTotal,  homeTotal, healthTotal, sportTotal, subscriptionsTotal, otherTotal;
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
  //"Groceries", "Restaurant", "Going out", "Shopping", "Transportation", "Home", "Health", "Sport", "Subscriptions", "Other"
  let groceriesTotal = 0;
  let restaurantTotal = 0;
  let goingOutTotal = 0;
  let shoppingTotal = 0;
  let transportationTotal = 0;
  let homeTotal = 0;
  let healthTotal = 0;
  let sportTotal = 0;
  let subscriptionsTotal = 0;
  let otherTotal = 0

  Transaction.find({ user: req.user._id }).then((transactionsFromDB) => {
    transactionsFromDB.forEach(function (trans) {

      total += trans.transaction;
     

      if (trans.tag === 'groceries'){
        groceriesTotal += trans.transaction;
      }

      if (trans.tag === 'restaurant') {
        restaurantTotal += trans.transaction;
      }

      if (trans.tag === 'going-out') {
        goingOutTotal += trans.transaction;
      } 

      if (trans.tag === 'shopping') {
        shoppingTotal += trans.transaction;
      }

      if (trans.tag === 'transportation') {
        transportationTotal += trans.transaction;
      }

      if (trans.tag === 'home') {
        homeTotal += trans.transaction;
      }

      if (trans.tag === 'health') {
        healthTotal += trans.transaction;
      }

      if (trans.tag === 'sport') {
        sportTotal += trans.transaction;
      }

      if (trans.tag === 'subscriptions') {
        subscriptionsTotal += trans.transaction;
      }

      if (trans.tag === 'other') {
        otherTotal += trans.transaction;
      }

      console.log(total, groceriesTotal, restaurantTotal, goingOutTotal, shoppingTotal, transportationTotal,  homeTotal, healthTotal, sportTotal, subscriptionsTotal, otherTotal)

      return total, groceriesTotal, restaurantTotal, goingOutTotal, shoppingTotal, transportationTotal,  homeTotal, healthTotal, sportTotal, subscriptionsTotal, otherTotal;
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
      user: currentUser
    
    })
   
    .then((createdTransaction) => {
      res.redirect("/wallet");
    });

   
  });








module.exports = router;
