const keys = require("../config/keys");
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

module.exports = {
    session: {
        secret: 'secrettexthere',
        saveUninitialized: true,
        resave: true,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7 * 2 // two weeks
        },
        // using store session on MongoDB using express-session + connect
        store: new MongoStore({
        url: keys.mongoURI,
        collection: 'sessions',
        ttl: 14 * 24 * 60 * 60 
        })
    }
}