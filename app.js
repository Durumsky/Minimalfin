require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const hbs = require('hbs');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');
const User = require('./models/User.model')

const session = require('express-session');
const MongoStore = require('connect-mongo');

const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(x => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
  .catch(err => console.error('Error connecting to mongo', err));

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';

//configure the session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false, // <== false if you don't want to save empty session object to the store
    cookie: {
      sameSite: 'none',
      httpOnly: true,
      maxAge: 60000 // 60 * 1000 ms === 1 min
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost/db-name'
    })
  })
);

//define which data is kept in the session, and how to recover this information from the database.
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

//initialize passport and passport session, both of them like a middleware:
app.use(passport.initialize());
app.use(passport.session());

// Routes middleware goes here
const index = require('./routes/index.routes');
app.use('/', index);
const router = require('./routes/auth.routes');
app.use('/', router);

module.exports = app;
