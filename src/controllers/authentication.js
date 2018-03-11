const jwt = require("jwt-simple");
const User = require("../models/user");
const config = require("../../config");

function tokenForUser(user) {
    const timestamp = new Date().getTime();
    return jwt.encode({ sub: user.id, iat: timestamp }, config.jwtSecret);
}

exports.signin = function(req, res) {
    res.send({ token: tokenForUser(req.user) });
};

exports.signup = function(req, res, next) {
    const { name, email: reqEmail, password } = req.body;

    if (!name || !reqEmail || !password) return res.status(422).send("You must provide name, email and password");

    const email = reqEmail.toLowerCase();

    User.findOne({ email })
        .then(existingUser => {
            if (existingUser) return res.status(422).send("Email already used");

            const user = new User({ name, email, password });

            user
                .save()
                .then(user => res.json({ token: tokenForUser(user) }))
                .catch(next);
        })
        .catch(next);
};
