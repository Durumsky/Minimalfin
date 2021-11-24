
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


router.get("/inspiration", isLoggedIn, (req, res) => {
    req.session.user = req.user;
    res.render('inspiration')
  })



module.exports = router;