const router = require("express").Router();
const { Challenge } = require("../models/challenge");
const { Game } = require("../models/game");
const { User } = require("../models/user");
const { checkAuth } = require("../util/auth");
const { catchAsync } = require("../util/errors");

// get the logged in user details
router.get("/", checkAuth, async (req, res, next) => {
    try {
        let { userId } = req;
        const user = await User.findById(userId);
        let { id, username, email, fname, lname, country, location } = user;
        let friends = await user.getFriends();
        let games = await user.getGames();
        return res.status(200).json({ id, username, email, friends, fname, lname, country, location, games });
    } catch (err) {
        next(err);
    }
});

router.get("/friends", checkAuth, async (req, res, next) => {
    try {
        let { userId } = req;
        let user = await User.findById(userId);
        let friends = await user.getFriends();
        return res.status(200).json(friends);
    } catch (err) {
        next(err);
    }
});

router.get("/challenges", checkAuth, async (req, res, next) => {
    try {
        let { userId } = req;
        let user = await User.findById(userId);
        let challenges = await Challenge.find({ challenged: user.username });
        challenges = challenges.map((challenge) => {
            let { id, challenged, challenger, color, roomID, timeLimit } = challenge;
            return { id, challenged, challenger, color, roomID, timeLimit };
        });
        console.log(challenges);
        res.status(200).json(challenges);
    } catch (err) {
        next(err);
    }
});

// TODO
// get history of games played
router.get("/games", checkAuth, async (req, res, next) => {
    try {
        let { userId } = req;
        const user = await User.findById(userId);
        let games = await user.getGames();
        if (!games) games = [];
        return res.status(200).json(gamesData);
    } catch (err) {
        next(err);
    }
});

// TODO
router.get("/games/:gameid", checkAuth, async (req, res, next) => {
    try {
    } catch (err) {
        next(err);
    }
});

// TODO
router.get("");

// TO BE TESTED
// update user details
router.patch("/", checkAuth, async (req, res, next) => {
    try {
        let { userId } = req;
        let updatedData = req.body;
        await User.findByIdAndUpdate(userId, { ...updatedData });
        let { id, username, email, fname, lname, location, country, fullName } = await User.findById(userId);
        return res.status(200).json({ user: { id, username, email, fname, lname, location, country, fullName } });
    } catch (err) {
        next(err);
    }
});

// TO BE TESTED
// delete the user
router.delete("/", checkAuth, async (req, res, next) => {
    try {
        let { userId } = req;
        let user = await User.findById(userId);
        await user.deleteOne();
        return res.status(204).json({ message: "Account deleted succesfully" });
    } catch (err) {
        next(err);
    }
});

// TO BE TESTED
// TODO: add some logic to notify the challenger if the challenged user declines the challenge
// accept or decline a challenge
// challengeID here refers to the roomID associated with the challenge
router.delete("/challenges/:challengeID", checkAuth, async (req, res, next) => {
    try {
        let { challengeID } = req.params;
        let challenge = await Challenge.findById(challengeID);
        if (!challenge)
            return res
                .status(404)
                .json({ message: "Challenge not found", description: "Challenge ID does not exists" });
        await challenge.deleteOne();
        return res.status(200).json({});
    } catch (err) {
        next(err);
    }
});

// TO BE TESTED
// add a friend
router.post("/friends/:friendusername", checkAuth, async (req, res, next) => {
    let { friendusername } = req.params;
    let { userId } = req;
    const user = await User.findById(userId);
    if (user.username === friendusername)
        res.status(405).json({
            error: { description: "Cannot add yourself as friend", message: "Cannot add this user as friends" },
        });
    let friendData = await User.findOne({ username: friendusername });
    if (friendData) {
        if (friendData.friends.includes(user._id)) {
            res.status(409).json({
                error: {
                    message: "User is already added as a friend",
                    description: "User is already added as a friend",
                },
            });
        } else {
            friendData.friends.push(user._id);
            await friendData.save();
            user.friends.push(friendData._id);
            await user.save();
            res.status(201).json({});
        }
    } else {
        res.status(404).json({
            error: { message: "User not found", description: "username not found in DB" },
        });
    }
});

// TODO
// remove a user from friends list
router.delete(
    "/friends/:friendid",
    checkAuth,
    catchAsync(async (req, res, next) => {
        const { friendid } = req.params;
        const { userId } = req;
        const user = await User.findById(userId);

        // Find the friend user to be removed
        const friendData = await User.findById(friendid);
        if (!friendData) {
            return res.status(404).json({ error: { message: "Friend user not found" } });
        }

        // Remove the friend from the user's friends list
        const friendIndex = user.friends.indexOf(friendData._id);
        if (friendIndex === -1) {
            return res.status(400).json({ error: { message: "Friend user not found in the friends list" } });
        }
        user.friends.splice(friendIndex, 1);
        await user.save();

        // Remove the user from the friend's friends list
        const userIndex = friendData.friends.indexOf(user._id);
        if (userIndex === -1) {
            return res.status(400).json({ error: { message: "User not found in the friend's friends list" } });
        }
        friendData.friends.splice(userIndex, 1);
        await friendData.save();

        return res.json({});
    })
);

// =============================================================

// TO BE TESTED
// get user details
router.get("/:userid", async (req, res, next) => {
    try {
        let userId = req.params.userid;
        const user = await User.findById(userId);
        let { id, username, email, fname, lname, country, location } = user;
        let friends = await user.getFriends();
        let games = await user.getGames();
        return res.status(200).json({ id, username, email, friends, fname, lname, country, location, games });
    } catch (err) {
        next(err);
    }
});

// get friends of the user
router.get("/:userid/friends", async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userid);
        const friends = await user.getFriends();
        return res.json({ friends });
    } catch (err) {
        next(err);
    }
});

// get current challenges of the user
router.get("/:userid/challenges", checkAuth, async (req, res, next) => {
    try {
        let { userId } = req;
        const user = await user.findById(userId);
        let challenges = await Challenge.find({ challenged: user.username });
        if (!challenges) challenges = [];
        console.log("Challenges to", user.username, challenges);
        res.json({ challenges: challenges });
    } catch (err) {
        next(err);
    }
});

// TODO
// get history of games played
router.get(
    "/:userid/games",
    checkAuth,
    catchAsync(async (req, res, next) => {
        const user = await User.findOne();
        let gamesData = await user.getGames();
        if (!gamesData) gamesData = [];
        return res.status(200).json({ data: gamesData });
    })
);

// TODO
// add a game
router.post("/:userid/game", checkAuth, async (req, res, next) => {
    const gameData = req.body;
    const gameDoc = await Game.create(gameData);
    return res.json({ data: gameDoc });
});

// TODO
// get a particular game
router.get(
    "/:userid/games/:gameid",
    checkAuth,
    catchAsync(async (req, res, next) => {
        const { gameid } = req.params;
        const gameData = await Game.findById(gameid);
        if (gameData) {
            return res.status(200).json({ data: gameData });
        } else {
            return res.status(404).json({ error: { message: "Game not found" } });
        }
    })
);

module.exports = router;
