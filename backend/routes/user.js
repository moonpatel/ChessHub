const router = require("express").Router();
const { Challenge } = require("../models/challenge");
const { User } = require("../models/user");
const { checkAuth } = require("../util/auth");

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
    let challenges = await Challenge.find({ challenged: username });
    if (!challenges) challenges = [];
    console.log("Challenges to", username, challenges);
    res.json({ success: true, challenges: challenges });
});

// accept or decline a challenge
// challengeID here refers to the roomID associated with the challenge
router.delete("/:username/challenges/:challengeID", async (req, res) => {
    let challengeResponse = req.query.response;
    let { challengeID } = req.params;
    if (challengeResponse === "accept") {
        let { deletedCount } = await Challenge.deleteOne({ roomID: challengeID });
        return res.json({ success: true });
    } else if (challengeResponse === "decline") {
        let { deletedCount } = await Challenge.deleteOne({ roomID: challengeID });
        return res.json({ success: true });
    } else {
        res.json({ success: false, error: { message: "Invalid query parameter" } });
    }
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
