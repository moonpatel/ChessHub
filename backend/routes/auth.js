const express = require("express");
const { createJSONToken, isValidPassword, validateJSONToken, generatePasswordHash } = require("../util/auth");
const { isValidEmail, isValidText } = require("../util/validation");
const { User } = require("../models/user");

const router = express.Router();

router.post("/signup", async (req, res, next) => {
    console.log(req.body);
    const data = { email: req.body.email, password: req.body.password, username: req.body.username };
    let errors = {};

    if (!isValidEmail(data.email)) {
        errors.email = "Invalid email.";
    } else {
        try {
            let user = await User.findOne({ email: data.email });
            if (user) {
                errors.email = "Email exists already.";
            }
        } catch (error) {
            throw error;
        }
    }

    if (!isValidText(data.password, 6)) {
        errors.password = "Password must be at least 6 characters long.";
    }

    let user = await User.findOne({ username: data.username });
    if (user) errors.username = "Username already exists";

    if (Object.keys(errors).length > 0) {
        return res.status(422).json({
            message: "User signup failed due to validation errors.",
            errors,
        });
    }

    try {
        let userData = {
            email: data.email,
            username: data.username,
            password_hash: await generatePasswordHash(data.password),
        };
        userDoc = new User(userData);
        await userDoc.save();
        const authToken = createJSONToken(userDoc.id);
        res.status(201).json({ message: "User created.", user: userDoc, token: authToken });
    } catch (error) {
        next(error);
    }
});

router.post("/login", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    let user;
    try {
        user = await User.findOne({ username });
        if (!user) return res.status(401).json({ message: "User not found" });
    } catch (error) {
        return res.status(401).json({ message: "AutheFntication failed." });
    }

    const pwIsValid = await isValidPassword(password, user.password_hash);
    if (!pwIsValid) {
        return res.status(422).json({
            message: "Invalid credentials.",
            errors: { credentials: "Invalid email or password entered." },
        });
    }

    const token = createJSONToken(user.id);
    return res.json({ token });
});

module.exports = router;
