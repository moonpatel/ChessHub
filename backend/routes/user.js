const router = require("express").Router();

const { checkAuth } = require("../util/auth");
const { User } = require("../models/user");

router.get("/:username/friends", async (req, res, next) => {
    const username = req.params.username;
    const user = await User.findOne({username});
    const friends = await user.getFriends();
    return res.json({ success: true, friends });
});

module.exports = router;
