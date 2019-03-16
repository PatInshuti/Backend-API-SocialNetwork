const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require('passport');
const session = require('express-session');
const users  = require("./routes/api/users");
const profile  = require("./routes/api/profile");
const posts  = require("./routes/api/posts");
const keys = require("./config/keys");
const jwt = require('jsonwebtoken');
const configSession = require('./config/configsession');

app.use(bodyParser.urlencoded({extended:false})); //body parser middle ware
app.use(bodyParser.json());
const db = require("./config/keys").mongoURI; //Database Config

// connect to MongoDB
mongoose
    .connect(db)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

app.use(passport.initialize());  //Passport middleWre
app.use(session(configSession.session)) //required for passport session
require('./config/passport')(passport); //passport config


passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
passport.deserializeUser(function(user, done) {
    done(null, user);
  });

//USE ROUTES
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

const port = process.env.PORT || 5000;

app.listen(port, ()=> console.log('server running on port ' + port));