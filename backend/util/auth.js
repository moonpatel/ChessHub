const { sign, verify } = require("jsonwebtoken");
const { compare, hash, genSalt } = require("bcryptjs");
const { NotAuthError } = require("./errors");

const KEY = "supersecret";

async function generatePasswordHash(password) {
    const password_hash = await hash(password, await genSalt(10));
    return password_hash;
}

function createJSONToken(id) {
    return sign({ id }, KEY, { noTimestamp: true });
}

function validateJSONToken(token) {
    return verify(token, KEY);
}

function isValidPassword(password, storedPassword) {
    return compare(password, storedPassword);
}

function checkAuthMiddleware(req, res, next) {
    if (req.method === "OPTIONS") {
        return next();
    }
    console.log(req.headers)
    if (!req.headers.authorization) {
        console.log("NOT AUTH. AUTH HEADER MISSING.");
        return next(new NotAuthError("Not authenticated."));
    }
    const authFragments = req.headers.authorization.split(" ");

    if (authFragments.length !== 2) {
        console.log("NOT AUTH. AUTH HEADER INVALID.");
        return next(new NotAuthError("Not authenticated."));
    }
    const authToken = authFragments[1];
    try {
        const validatedToken = validateJSONToken(authToken);
        req.userid = validatedToken;
    } catch (error) {
        console.log("NOT AUTH. TOKEN INVALID.");
        return next(new NotAuthError("Not authenticated."));
    }
    next();
}

exports.createJSONToken = createJSONToken;
exports.validateJSONToken = validateJSONToken;
exports.isValidPassword = isValidPassword;
exports.checkAuth = checkAuthMiddleware;
exports.generatePasswordHash = generatePasswordHash;
