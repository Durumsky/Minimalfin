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

router.post("/transaction", (req, res, next) => {
    const { transaction, tag } = req.body;
    const currentUser = req.session.user
  
    Transaction.create({
      transaction: transaction,
      tag: tag,
      user: currentUser._id
    
    }).then((createdTransaction) => {
      res.redirect(`/wallet`);
    });
  });







module.exports = router;