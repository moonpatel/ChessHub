const router = require("express").Router();
const { User } = require("../models/user");

// TODO
// get user details
router.get("/:username", async (req, res, next) => {
    let username;
});

// TODO
// update user details
router.post("/:username", async (req, res, next) => {});

// get friends of the user
router.get("/:username/friends", async (req, res, next) => {
    const username = req.params.username;
    const user = await User.findOne({ username });
    const friends = await user.getFriends();
    return res.json({ success: true, friends });
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
