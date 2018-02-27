const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

userSchema.pre("save", function(next) {
    const user = this;

    bcrypt
        .genSalt(10)
        .then(salt =>
            bcrypt.hash(user.password, salt).then(hash => {
                user.password = hash;
                next();
            })
        )
        .catch(next);
});

const ModelClass = mongoose.model("user", userSchema);

module.exports = ModelClass;
