const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require('passport');

const users  = require("./routes/api/users");
const profile  = require("./routes/api/profile");
const posts  = require("./routes/api/posts");

//body parser middle ware
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//db CONfig
const db = require("./config/keys").mongoURI;

// connect to MongoDB
mongoose
    .connect(db)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

//Passport middleWre

app.use(passport.initialize());

//passport config
require('./config/passport')(passport);

//USE ROUTES
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

const port = process.env.PORT || 5000;

app.listen(port, ()=> console.log(`server running on port {port}`));