const router = require("express").Router();
const { User } = require("../models/user");
const { checkAuth } = require("../util/auth");
const { pendingChallenges } = require("./room");

// TODO
// get user details
router.get("/:username", async (req, res, next) => {
    let username;
});

// TODO
// update user details
router.post("/:username", async (req, res, next) => {});

// get friends of the user
router.get("/:username/friends", checkAuth, async (req, res, next) => {
    const username = req.params.username;
    const user = await User.findOne({ username });
    if (user) {
        const friends = await user.getFriends();
        return res.json({ success: true, friends });
    } else {
        return res.json({ success: false, error: "Invalid username" });
    }
});

// TODO
// add a friend
router.post("/:username/friends/:friend_username", async (req, res, next) => {
    res.send("TODO");
});

// TODO
// remove a user from friends list
router.delete("/:username/friends/:friend_username", async (req, res, next) => {
    res.send("TODO");
});

// get current challenges of the user
router.get("/:username/challenges", async (req, res, next) => {
    let username = req.params.username;
    let challenges = pendingChallenges.get(username);
    if (!challenges) challenges = [];
    console.log(username, challenges);
    res.json({ success: true, challenges: challenges });
});

// TODO
// get history of games played
router.get("/:username/games", async (req, res, next) => {
    res.send("TODO");
});

// TODO
// get a particular game
router.get("/:username/games/:gameid", async (req, res, next) => {
    res.send("TODO");
});

module.exports = router;
