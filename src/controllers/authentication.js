const User = require("../models/user");

exports.signup = function(req, res, next) {
    const { email: reqEmail, password } = req.body;

    if (!reqEmail || !password) return res.status(422).send({ error: "You must provide email and password" });

    const email = reqEmail.toLowerCase();

    User.findOne({ email })
        .then(existingUser => {
            if (existingUser) return res.status(422).send({ error: "Email already used" });

            const user = new User({ email, password });

            user
                .save()
                .then(({ id }) => res.json({ id }))
                .catch(next);
        })
        .catch(next);
};
