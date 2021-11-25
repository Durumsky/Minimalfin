// routes/auth.routes.js

const { Router } = require("express");
const router = new Router();
const passport = require("passport");

// User and transaction models
const User = require("../models/User.model.js");
const Inspiration = require("../models/Inspiration.model.js");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

const isLoggedIn = require("./middlewareLoggedIn");

router.get("/inspiration", isLoggedIn, (req, res) => {
  req.session.user = req.user;

Inspiration.find({ user: req.user._id })
  .populate('user')
  .sort({ $natural: -1})
  .limit(5)
  .then((inspirationsFromDB) => {
    console.log(inspirationsFromDB)
    res.render('inspiration', {
      inspirations: inspirationsFromDB
    })
  })
})


router.post("/inspiration", (req, res, next) => {
    const { tag, text } = req.body;
    const currentUser = req.session.user
  
    Inspiration.create({
      text: text,
      tag: tag,
      user: currentUser
    })
    .then((createdInspiration) => {
      res.redirect("/inspiration");
    });

  });


module.exports = router;
