const { Router } = require('express');
const router = new Router();
const passport = require('passport');

// Require user model
const User = require('../models/User.model.js');

// Add bcrypt to encrypt passwords
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

router.get('/signup', (req, res, next) => res.render('auth/signup'));
 
router.post('/signup', (req, res, next) => {
  const { username, password } = req.body;
 
  // 1. Check username and password are not empty
  if (!username || !password) {
    res.render('auth/signup', { errorMessage: 'Indicate username and password' });
    return;
  }
 
  User.findOne({ username })
    .then(user => {
      // 2. Check user does not already exist
      if (user !== null) {
        res.render('auth/signup', { message: 'The username already exists' });
        return;
      }
 
      // Encrypt the password
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);
 
      //
      // Save the user in DB
      //
 
      const newUser = new User({
        username,
        password: hashPass
      });
 
      newUser
        .save()
        .then(() => res.redirect('/'))
        .catch(err => next(err));
    })
    .catch(err => next(err));
});

//login
router.get('/login', (req, res, next) => res.render('auth/login'));

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, theUser, failureDetails) => {
    if (err) {
      // Something went wrong authenticating user
      return next(err);
    }
 
    if (!theUser) {
      // Unauthorized, `failureDetails` contains the error messages from our logic in "LocalStrategy" {message: '…'}.
      res.render('auth/login', { errorMessage: 'Wrong password or username' });
      return;
    }
 
    // save user in session: req.user
    req.login(theUser, err => {
      if (err) {
        // Session save went bad
        return next(err);
      }
 
      // All good, we are now logged in and `req.user` is now set
      res.redirect('/');
    });
  })(req, res, next);
});

// Add passport

const ensureLogin = require('connect-ensure-login');

router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('passport/private', { user: req.user });
});

//If a user is in the session (if req.user exists), then the user can access a page. Otherwise, they can’t.
router.get('/private-page', (req, res) => {
  if (!req.user) {
    res.redirect('/login'); // can't access the page, so go and log in
    return;
  }
 
  // ok, req.user is defined
  res.render('private', { user: req.user });
});

module.exports = router;
