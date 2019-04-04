const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');
const cookieParser = require('cookie-parser');

// Load Input Validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');
// Load User model
const User = require('../../models/User');

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Users Works' }));

// @route   GET api/users/register
// @desc    Register user
// @access  Public
router.post('/register', (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = 'Email already exists';
      return res.status(400).json(errors);
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: '200', // Size
        r: 'pg', // Rating
        d: 'mm' // Default
      });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route   GET api/users/login
// @desc    Login User / Returning JWT Token
// @access  Public
router.post('/login', (req, res) => {
//   const { errors, isValid } = validateLoginInput(req.body);

//   // Check Validation
//   if (!isValid) {
//     return res.status(400).json(errors);
//   }
  const errors = {}; 
  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email }).then(user => {
    // Check for user
    if (!user) {
      errors.email = 'User not found';
      return res.status(404).json(errors);
    }

    // Check Password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User Matched
        const payload = { id: user.id, name: user.name, avatar: user.avatar }; // Create JWT Payload

        // Sign Token
        var token = jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 });

        // jwt.sign(payload, keys.secretOrKey, { expiresIn: 60 },(err, token) => {
        //   Jtoken = token;
        //     res.json({
        //       success: true,
        //       token: 'Bearer ' + token
        //     });
        //   }
        // );
        res.cookie('jwt',token, {httpOnly: true}); // add cookie here

        res.json({'success':'match'})
        //console.log(token);
      } else {
        errors.password = 'Password incorrect';
        return res.status(400).json(errors);
      }
    });
  });
 
});

function basicauth(req, res, next){
  req.headers.authorization = Jtoken;
  console.log('After ' + req.headers.authorization);
  next()
}

// @route   GET api/users/current
// @desc    Return current user
// @access  Private

router.get('/current', passport.authenticate('jwt', { session: false }),
  (req, res) => {
    

    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);



// =========================================================================
// FACEBOOK ================================================================
// =========================================================================

router.get('/auth/facebook', passport.authenticate('facebook', { 
  scope : ['email','public_profile', 'photos']
}));

//CALL BACK FROM API
router.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect : '/'}), (req, res) =>{
      // Successful authentication, AND ASSIGN THE USER A JWT TOKEN
});



// =========================================================================
// GOOGLE ==================================================================
// =========================================================================
router.get('/auth/google',
passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

//CALL BACK FROM API
router.get('/auth/google/callback', 
passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  
  const payload = { id:req.user.id, google_id: req.user.google.id, name: req.user.google.displayName, avatar: req.user.google.picture, gender:req.user.google.gender }; // Create JWT Payload
  // Sign Token
  jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 },(err, token) => {
      res.json({
          success: true,
          token: 'Bearer ' + token
      });
      }
  );
});


// =========================================================================
// TWITTER =================================================================
// =========================================================================

router.get('/auth/twitter', passport.authenticate('twitter'));

//CALL BACK FROM API
router.get('/auth/twitter/callback',
passport.authenticate('twitter', { failureRedirect: '/login' }), (req, res)=>{
  const payload = { id:req.user.id, google_id: req.user.google.id, name: req.user.google.displayName, avatar: req.user.google.picture, gender:req.user.google.gender }; // Create JWT Payload
  // Sign Token
  jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 },(err, token) => {
    res.json({
        success: true,
        token: 'Bearer ' + token
    });
    }
);

});

// =========================================================================
// GITHUB ==================================================================
// =========================================================================

router.get('/auth/github',
passport.authenticate('github', { scope: [ 'user:email' ] }));

router.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }),(req, res) =>{
  
  const payload = { id:req.user.id, github_id: req.user.github.id, name: req.user.github.username, avatar: req.user.avatar }; // Create JWT Payload
  // Sign Token
  jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 },(err, token) => {
      res.json({
          success: true,
          token: 'Bearer ' + token
      });
      }
  );
});

//Applies for every authentication -- Basically blacklist the token used
router.get('/logout', passport.authenticate('jwt', {session:false}), (req, res) =>{
  console.log(req.user);
});
module.exports = router;
