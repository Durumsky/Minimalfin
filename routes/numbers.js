// routes/auth.routes.js

const { Router } = require("express");
const router = new Router();
const passport = require("passport");

// User and Transaction models
const User = require("../models/User.model.js");
const Transaction = require("../models/Transaction.model.js");
const Inspiration = require("../models/Inspiration.model.js");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

const isLoggedIn = require("./middlewareLoggedIn");


router.get("/numbers", isLoggedIn, (req, res) => {
  req.session.user = req.user;
  const currentUser = req.session.user;

  //variables:
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

  let biggestTag

  Transaction.find({}).then((transactionsFromDB) => {
    transactionsFromDB.forEach(function (trans) {
      //console.log(trans.tag, trans.user, currentUser._id)

      Transaction.find({ user: req.user._id }).then((transactionsFromDB) => {
        transactionsFromDB.forEach(function (trans) {
          if (trans.tag === "groceries") {
            groceriesTotal += trans.transaction;
          }

          if (trans.tag === "restaurant") {
            restaurantTotal += trans.transaction;
          }

          if (trans.tag === "going-out") {
            goingOutTotal += trans.transaction;
          }

          if (trans.tag === "shopping") {
            shoppingTotal += trans.transaction;
          }

          if (trans.tag === "transportation") {
            transportationTotal += trans.transaction;
          }

          if (trans.tag === "home") {
            homeTotal += trans.transaction;
          }

          if (trans.tag === "health") {
            healthTotal += trans.transaction;
          }

          if (trans.tag === "sport") {
            sportTotal += trans.transaction;
          }

          if (trans.tag === "subscriptions") {
            subscriptionsTotal += trans.transaction;
          }

          if (trans.tag === "other") {
            otherTotal += trans.transaction;
          }

          var allTagsTotals = {
            groceries: groceriesTotal,
            restaurant: restaurantTotal,
            goingOut: goingOutTotal,
            shopping: shoppingTotal,
            transportation: transportationTotal,
            home: homeTotal,
            health: healthTotal,
            subscriptions: subscriptionsTotal,
            other: otherTotal,
          };
          var biggestExpense = Math.max.apply(
              null,
              Object.values(allTagsTotals)
            ),
            expense = Object.keys(allTagsTotals).find(function (a) {
              return allTagsTotals[a] === biggestExpense;
            });

            if (trans.tag === expense && trans.user === currentUser._id) {
              biggestTag = trans.tag
            }     
        });
    });
  })

    Inspiration.find({ user: req.user._id })
      .populate("user")
      .sort({ $natural: -1 })
      .limit(5)
      .then((inspirationsFromDB) => {
        res.render("inspiration", {
          inspirations: inspirationsFromDB, biggestTag: biggestTag
        });
      });
  });
});



module.exports = router;