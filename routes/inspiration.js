// routes/auth.routes.js

const { Router } = require("express");
const router = new Router();
const passport = require("passport");

// User and transaction models
const User = require("../models/User.model.js");
const Inspiration = require("../models/Inspiration.model.js");
const Transaction = require("../models/Transaction.model.js");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

const isLoggedIn = require("./middlewareLoggedIn");

router.get("/inspiration", isLoggedIn, (req, res) => {
  req.session.user = req.user;
  const currentUser = req.session.user._id;

  //variables:
  let groceriesTotal = 0;
  let restaurantTotal = 0;
  let entertainmentTotal = 0;
  let shoppingTotal = 0;
  let transportationTotal = 0;
  let homeTotal = 0;
  let healthTotal = 0;
  let sportTotal = 0;
  let subscriptionsTotal = 0;
  let otherTotal = 0;

  let biggestTag
  let owner

  Transaction.find({}).then((transactionsFromDB) => {
    transactionsFromDB.forEach(function (trans) {
      //console.log(trans.tag, trans.user, currentUser._id)

      Transaction.find({ user: req.user._id }).then((transactionsFromDB) => {
        transactionsFromDB.forEach(function (trans) {
          if (trans.tag === "Groceries") {
            groceriesTotal += trans.transaction;
          }

          if (trans.tag === "Restaurant") {
            restaurantTotal += trans.transaction;
          }

          if (trans.tag === "Entertainment") {
            entertainmentTotal += trans.transaction;
          }

          if (trans.tag === "Shopping") {
            shoppingTotal += trans.transaction;
          }

          if (trans.tag === "Transportation") {
            transportationTotal += trans.transaction;
          }

          if (trans.tag === "Home") {
            homeTotal += trans.transaction;
          }

          if (trans.tag === "Health") {
            healthTotal += trans.transaction;
          }

          if (trans.tag === "Sport") {
            sportTotal += trans.transaction;
          }

          if (trans.tag === "Subscriptions") {
            subscriptionsTotal += trans.transaction;
          }

          if (trans.tag === "Other") {
            otherTotal += trans.transaction;
          }

          var allTagsTotals = {
            groceries: groceriesTotal,
            restaurant: restaurantTotal,
            entertainment: entertainmentTotal,
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

    Inspiration.find()
      .sort({ $natural: -1 })
      .limit(5)
      .then((inspirationsFromDB) => {
        const newArray = inspirationsFromDB.map(post => {
          console.log(post.user, currentUser)
          if (post.user === currentUser) {

            return {
              ...post,
              owner: true
            }
          } else {
            return {
              ...post,
              owner: false
            }
          }
        })
        res.render("inspiration", {

          inspirations: inspirationsFromDB, biggestTag: biggestTag, currentUser: currentUser, owner: owner, newArray: newArray

        });
      });
  });

  router.post("/inspiration", (req, res, next) => {
    const { tag, text } = req.body;
    const currentUser = req.session.user;

    Inspiration.create({
      text: text,
      tag: tag,
      user: currentUser._id
    }).then((createdInspiration) => {
      res.redirect("/inspiration");
    });
  });
})

router.post('/inspiration/edit/:id', (req, res, next) => {
  const id = req.params.id

  const { text, tag, user } = req.body

  Inspiration.findByIdAndUpdate(id, {
      text,
      tag,
      user,
  }, { new: true })
      .then(updatedInspiration => {
          res.redirect('/inspiration')
      })
      .catch(err => next(err))
});

router.get('/inspiration/delete/:id', (req, res, next) => {
  const id = req.params.id
  Inspiration.findByIdAndDelete(id)
      .then(() => {
          // redirect to the list
          res.redirect('/inspiration')
      })
      .catch(err => {
          next(err)
      })
});



module.exports = router;
