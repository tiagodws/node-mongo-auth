const passport = require("passport");
const passportJwt = require("passport-jwt");
const LocalStrategy = require("passport-local");

const User = require("../models/user");
const config = require("../../config");

const { Strategy, ExtractJwt } = passportJwt;

const localOptions = { usernameField: "email" };
const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
    User.findOne({ email })
        .then(user => {
            if (!user) return done(null, false);

            return user.comparePassword(password).then(isMatch => done(null, isMatch && user));
        })
        .catch(done);
});

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader("authorization"),
    secretOrKey: config.jwtSecret,
};

const jwtLogin = new Strategy(jwtOptions, (payload, done) => {
    User.findById(payload.sub)
        .then(user => done(null, user || false))
        .catch(err => done(err, false));
});

passport.use(jwtLogin);
passport.use(localLogin);
