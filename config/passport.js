const passport = require("passport"); 
const JwtStrategy = require('passport-jwt').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require('mongoose');
const User = mongoose.model('users');
const keys = require('../config/Keys');
const authKeys = require("../config/auth");
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var GitHubStrategy = require('passport-github2').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;

// =========================================================================
// JWT CUSTOM LOCAL AUTHENTICATION =========================================
// =========================================================================

const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport =>{
    passport.use(new JwtStrategy(opts, (jwt_payload, done) =>{
        
        User.findById(jwt_payload.id)
            .then(user =>{
                if (user){
                    return done(null, user);
                }

                return done(null, false);
            })
            .catch(err => console.log(err));

    }));
};


// =========================================================================
// FACEBOOK ================================================================
// =========================================================================
passport.use(new FacebookStrategy({

// pull in our app id and secret from our auth.js file
clientID        : authKeys.facebookAuth.clientID,
clientSecret    : authKeys.facebookAuth.clientSecret,
callbackURL     : authKeys.facebookAuth.callbackURL,
profileFields: ['email','profileUrl','photos']
},

// facebook will send back the token and profile
function(token, refreshToken, profile, done) {

    // find the user in the database based on their facebook id
    User.findOne({ 'facebook.id' : profile.id })
        .then(user =>{
            if(user) return done(null, user);
            else{
                const newUser = new User();
                newUser.facebook.id    = profile.id; // set the users facebook id                   
                newUser.facebook.token = token; // we will save the token that facebook provides to the user                    
                newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned

                newUser.save()
                    .then(user =>{
                        return done(null, user)
                    })
                    .catch(err => console.log(err));
                }
        })
        .catch(err=> console.log(err));  
}
));



// =========================================================================
// GOOGLE ==================================================================
// =========================================================================

passport.use(new GoogleStrategy({
    clientID: authKeys.googleAuth.clientID,
    clientSecret: authKeys.googleAuth.clientSecret,
    callbackURL: authKeys.googleAuth.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
      User.findOne({'google.id' : profile._json.sub})
        .then(user =>{
            if(user) return done(null, user);
            else{
                const newUser = new User();
                newUser.name = profile._json.name;
                newUser.google.id = profile._json.sub; 
                newUser.google.displayName = profile._json.given_name;
                newUser.google.profile = profile._json.profile;
                newUser.google.avatar = profile._json.picture;

                newUser.save().then(user => {
                    return done(null, user);
                })
                .then(err => console.log(err));
            }
        })
        .catch(err => console.log(err));
  }
));

// =========================================================================
// TWITTER =================================================================
// =========================================================================

passport.use(new TwitterStrategy({
    consumerKey: authKeys.twitterAuth.consumerKey,
    consumerSecret: authKeys.twitterAuth.consumerSecret,
    callbackURL: authKeys.twitterAuth.callbackURL
  },
  function(token, tokenSecret, profile, done) {
      console.log(profile);
      User.findOne({'twitter.id':profile._json.id})
        .then(user =>{
            console.log("user exist")
            if(user) return done(null, user);
            else{
                const newUser = new User();
                newUser.name = profile._json.name;
                newUser.twitter.id = profile._json.id;
                newUser.twitter.displayName = profile._json.name;
                newUser.twitter.picture = profile._json.profile_image_url;
                
                newUser.save().then(user=>{
                    return done(null, user);
                })
                .catch(err => console.log(err));
            }
        })
        .catch(err => console.log(err));
  }
));

// =========================================================================
// GITHUB ==================================================================
// =========================================================================


passport.use(new GitHubStrategy({
    clientID: authKeys.githubAuth.clientID,
    clientSecret: authKeys.githubAuth.clientSecret,
    callbackURL: authKeys.githubAuth.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {

    User.findOne({'github.id':profile._json.id})
        .then(user =>{
            if(user){
                //user already exists
                return done(null, user)
            }
            else{
                //create a new user
                const newUser = new User(); 
                newUser.name = profile._json.name,
                newUser.github.id = profile._json.id,
                newUser.github.username = profile._json.login,
                newUser.github.fullname = profile._json.name,
                newUser.avatar = profile._json.avatar_url,
                newUser.bio = profile._json.bio,
                newUser.url = profile._json.url

                newUser.save().then(user => {
                    return done(null, user);
                })
                .catch(err => console.log(err));
            }
        })
        .catch(err => console.log(err));
  }
));