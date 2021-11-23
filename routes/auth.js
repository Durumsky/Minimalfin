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
const isLoggedOut = require("./middlewareLoggedOut");

// router.get("/wallet", isLoggedIn, (req, res) => {
// res.render("wallet")
// })

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

router.get("/login", isLoggedIn, (req, res) => {
  res.redirect("/wallet")
  })

router.get("/signup", isLoggedIn, (req, res) => {
  res.redirect("/wallet")
  })


router.post('/signup', (req, res, next) => {
  const { username, email, password } = req.body;


  if (password.length < 8) {
    res.render('index', {
      errorMessage: 'Your password has to be at least 8 characters!',
    });
    return;
  }

  if (username.length === 0) {
    res.render('index', { errorMessage: 'Please provide a username!' });
    return;
  }

  if (email.length === 0) {
    res.render('index', { errorMessage: 'Please provide an email address!' });
    return;
  }

  User.findOne({ username: username }).then((userFromDB) => {
    if (userFromDB !== null) {
      res.render('index', { errorMessage: 'This username is already taken' });
      return;
    } else {
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync(password, salt);

      User.create({ username: username, email: email, password: hash })
        .then((createdUser) => {
          res.redirect('/wallet');
        })
        .catch((err) => {
          next(err);
        });
    }
  });
});

router.post('/login', (req, res, next) => {
  const { username, password } = req.body;

  if (!username) {
    return res
      .status(400)
      .render("index", { loginError: "Please provide your username." });
  }

  if (password.length < 8) {
    return res.status(400).render("index", {
      loginError: "Your password needs to be at least 8 characters long.",
    });
  }

  // Search the database for a user with the username submitted in the form
  User.findOne({ username })
    .then((user) => {
      // If the user isn't found, send the message that user provided wrong credentials
      if (!user) {
        return res
          .status(400)
          .render("index", { loginError: "Wrong credentials." });
      }

      // If user is found based on the username, check if the in putted password matches the one saved in the database
      bcrypt.compare(password, user.password).then((isSamePassword) => {
        if (!isSamePassword) {
          return res
            .status(400)
            .render("index", { loginError: "Wrong credentials." });
        }
        req.session.user = user;
        // req.session.user = user._id; // ! better and safer but in this case we saving the entire user object
        return res.redirect("/wallet");
      });
    })

    .catch((err) => {
      // in this case we are sending the error handling to the error handling middleware that is defined in the error handling file
      // you can just as easily run the res.status that is commented out below
      next(err);
      // return res.status(500).render("login", { errorMessage: err.message });
    });
});


router.get("/logout", (req, res) => {
  req.session.destroy()
  req.logout();
  res.render("index");
});

module.exports = router;
