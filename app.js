// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const app = express();

//require jsdom
// GLOBAL.document = new JSDOM(html).window.document;
// const jsdom = require('jsdom')
// const JSDOM = jsdom.JSDOM


// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

//passport:

const session = require('express-session');
const MongoStore = require('connect-mongo');

const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Express-session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false, // <== false if you don't want to save empty session object to the store
    cookie: {
    
      httpOnly: true,
      maxAge: 60*1000*60 // 60 * 1000 ms === 1 min
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI
    })
  })
);

//Methods of Passport:
const User = require('./models/User.model.js');


passport.serializeUser((user, cb) => cb(null, user._id));

passport.deserializeUser((id, cb) => {
  User.findById(id)
    .then(user => cb(null, user))
    .catch(err => cb(err));
});

passport.use(
	new LocalStrategy((username, password, done) => {
		// this logic will be executed when we log in
		User.findOne({ username: username })
			.then(userFromDB => {
				if (userFromDB === null) {
					// there is no user with this username
					done(null, false, { message: 'Wrong Credentials' });
				} else {
					done(null, userFromDB);
				}
			})
	})
)

// initialize passport and passport session, both of them like a middleware:
app.use(passport.initialize());
app.use(passport.session());
// default value for title local
const projectName = "minimalfin";
const capitalized = (string) => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)} created with IronLauncher`;

// 👇 Start handling routes here
const index = require("./routes/index");
app.use("/", index);

const router = require('./routes/auth');
app.use('/', router);

const transactions = require('./routes/transactions');
app.use('/', transactions)

const numbers = require('./routes/numbers');
app.use('/', numbers);

const inspiration = require('./routes/inspiration');
app.use('/', inspiration);

const numbersShowall = require('./routes/transactions');
app.use('/', numbersShowall)

const charts = require('./public/js/charts.js');
app.use('/', charts)



// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;