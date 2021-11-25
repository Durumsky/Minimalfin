// routes/auth.routes.js

const { Router } = require("express");
const router = new Router();
const passport = require("passport");

// User and Transaction models
const User = require("../models/User.model.js");
const Transaction = require("../models/Transaction.model.js");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

const isLoggedIn = require("./middlewareLoggedIn");


router.get("/numbers", isLoggedIn, (req, res) => {
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
  let otherTotal = 0;

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

      return total, groceriesTotal, restaurantTotal, goingOutTotal, shoppingTotal, transportationTotal,  homeTotal, healthTotal, sportTotal, subscriptionsTotal, otherTotal;
    });
    res.render('numbers')
  })
})



module.exports = router;