const express = require("express");
const {
    createJSONToken,
    isValidPassword,
    validateJSONToken,
    generatePasswordHash,
    checkAuth,
} = require("../util/auth");
const { isValidEmail, isValidText } = require("../util/validation");
const { User } = require("../models/user");
const { z, ZodError } = require("zod");

const router = express.Router();

const loginSchema = z
    .object({
        username: z
            .string()
            .min(5, { message: "Username should not be less than 5 characters" })
            .max(15, { message: "Username should not be more than 15 characters" }),
        password: z
            .string()
            .min(8, { message: "Password should not be less than 8 characters" })
            .max(15, { message: "Password should not be more than 15 characters" }),
    })
    .required();

const signupSchema = z
    .object({
        username: z
            .string()
            .min(5, { message: "Username should not be less than 5 characters" })
            .max(15, { message: "Username should not be more than 15 characters" }),
        email: z.string().email({ message: "Please enter a valid email address" }),
        password: z
            .string()
            .min(8, { message: "Password should not be less than 8 characters" })
            .max(15, { message: "Password should not be more than 15 characters" }),
    })
    .required();

router.post("/signup", async (req, res, next) => {
    try {
        const data = { email: req.body.email, password: req.body.password, username: req.body.username };

        signupSchema.parse(data);

        // check if username or email already exists
        if (await User.findOne({ username: data.username }))
            return res.status(409).json({ error: { username: "username already taken" } });
        if (await User.findOne({ email: data.email }))
            return res.status(409).json({ error: { email: "user with this email already exists" } });

        let userData = {
            email: data.email,
            username: data.username,
            password_hash: await generatePasswordHash(data.password),
        };
        let userDoc = await User.create(userData);
        const authToken = createJSONToken(userDoc.id);

        const { id, username, email } = userDoc;
        res.setHeader('Host',process.env.HOSTNAME).status(201).cookie("auth-token", authToken, { httpOnly: true, sameSite: "strict" }).json({
            user: { id, username, email },
            token: authToken,
        });
    } catch (err) {
        if (err instanceof ZodError) {
            return res.status(400).json({ message: "Invalid data submitted", description: "Invalid schema" });
        }
        next(err);
    }
});

router.post("/login", async (req, res, next) => {
    try {
        let username = req.body.username,
            password = req.body.password;

        loginSchema.parse({ username, password });

        let user;
        user = await User.findOne({ username });
        if (!user)
            return res.status(404).json({
                message: "User does not exist",
                description: "'username' not found in db",
            });

        const pwIsValid = await isValidPassword(password, user.password_hash);
        if (!pwIsValid) {
            return res.status(401).json({
                message: "Invalid credentials",
                description: "Invalid credentials",
            });
        }

        const token = createJSONToken(user.id);
        res.cookie("auth-token", token, { httpOnly: true, sameSite: "strict" });
        return res.setHeader('Host',process.env.HOSTNAME)
            .status(200)
            .json({ token, user: { id: user.id, username: user.username, email: user.email } });
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(401).json({ message: "Invalid Credentials", description: "Invalid schema" });
        }
        next(error);
    }
});

router.delete("/logout", checkAuth, (req, res, next) => {
    try {
        res.setHeader('Host',process.env.HOSTNAME).clearCookie("auth-token", { httpOnly: true, sameSite: "strict" });
        res.status(200).json({});
    } catch (err) {
        next(err);
    }
});

module.exports = router;
