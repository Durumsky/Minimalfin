

const router = require("express").Router();
const passport = require("passport");

// User and inspiration models
const User = require("../models/User.model.js");
const Inspiration = require("../models/Inspiration.model.js");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

const isLoggedIn = require("./middlewareLoggedIn");


router.get("/inspiration", isLoggedIn, (req, res) => {
  req.session.user = req.user;
  res.render('inspiration')
})

router.post("/inspiration", (req, res, next) => {

  console.log(req.body)
  res.send(req.body)
  // Inspiration.create({
  //   text: text,
  //   tag: tag,
  //   user: currentUser
  // })
  // .then((createdInspiration) =>
  // res.redirect('/inspiration')
  // )
})
module.exports = router;