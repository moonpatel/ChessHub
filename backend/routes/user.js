const router = require("express").Router();
const { Challenge } = require("../models/challenge");
const { Game } = require("../models/game");
const { User } = require("../models/user");
const { checkAuth } = require("../util/auth");
const { catchAsync } = require("../util/errors");

// API enpoints related to a user, requires authentication

// extracts the user details of userId. Use only if the req object contains userId field.
const extractUserDetails = async (req, res, next) => {
  try {
    let { userId } = req;
    if (!userId) throw { message: "userId not found" };
    else {
      let user = await User.findById(userId);
      req.user = user;
    }
  } catch (err) {
    next(err);
  }
  next();
};

// TO BE TESTED
// get the logged in user details
router.get("/", checkAuth, extractUserDetails, async (req, res, next) => {
  try {
    let { user } = req;
    let { id, username, email, fname, lname, country, location } = user;
    let friends = await user.getFriends();
    let games = await user.getGames();
    return res.status(200).json({
      id,
      username,
      email,
      friends,
      fname,
      lname,
      country,
      location,
      games,
    });
  } catch (err) {
    next(err);
  }
});

// TO BE TESTED
// update logged in user details
router.patch("/", checkAuth, async (req, res, next) => {
  try {
    let { userId } = req;
    let updatedData = req.body;
    await User.findByIdAndUpdate(userId, { ...updatedData });
    let { id, username, email, fname, lname, location, country, fullName } =
      await User.findById(userId);
    return res.status(200).json({
      user: {
        id,
        username,
        email,
        fname,
        lname,
        location,
        country,
        fullName,
      },
    });
  } catch (err) {
    next(err);
  }
});

// TO BE TRIED ONCE
// TO BE TESTED
// delete logged in user account
router.delete("/", checkAuth, extractUserDetails, async (req, res, next) => {
  try {
    let { user } = req;
    await user.deleteOne();
    return res.status(204).json({ message: "Account deleted succesfully" });
  } catch (err) {
    next(err);
  }
});

// TO BE TESTED
// get all friends of logged in user
router.get(
  "/friends",
  checkAuth,
  extractUserDetails,
  async (req, res, next) => {
    try {
      let { user } = req;
      let friends = await user.getFriends();
      return res.status(200).json(friends);
    } catch (err) {
      next(err);
    }
  }
);

// TO BE TESTED
// add a friend
router.post(
  "/friends",
  checkAuth,
  extractUserDetails,
  async (req, res, next) => {
    let { friendUsername } = req.body;
    const { user } = req;
    if (user.username === friendUsername)
      res.status(405).json({
        error: {
          description: "Cannot add yourself as friend",
          message: "Cannot add this user as friends",
        },
      });
    let friendData = await User.findOne({ username: friendUsername });
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
        error: {
          message: "User not found",
          description: "username not found in DB",
        },
      });
    }
  }
);

// TO BE TESTED
// remove a user from friends list
router.delete(
  "/friends",
  checkAuth,
  extractUserDetails,
  catchAsync(async (req, res, next) => {
    const { friendUsername } = req.body;
    const { user } = req;

    // Find the friend user to be removed
    const friendData = await User.findOne({ username: friendUsername });
    if (!friendData) {
      return res.status(404).json({
        error: {
          message: "Cannot add username that does not exists",
          description: "username to be added as friend not found.",
        },
      });
    }

    // Remove the friend from the user's friends list
    const friendIndex = user.friends.indexOf(friendData._id);
    if (friendIndex === -1) {
      return res.status(400).json({
        error: { message: "Friend user not found in the friends list" },
      });
    }
    user.friends.splice(friendIndex, 1);
    await user.save();

    // Remove the user from the friend's friends list
    const userIndex = friendData.friends.indexOf(user._id);
    if (userIndex === -1) {
      return res.status(400).json({
        error: { message: "User not found in the friend's friends list" },
      });
    }
    friendData.friends.splice(userIndex, 1);
    await friendData.save();

    return res.json({});
  })
);

// TO BE TESTED
// get all logged in users challenges
router.get(
  "/challenges",
  checkAuth,
  extractUserDetails,
  async (req, res, next) => {
    try {
      let { user } = req;
      let challenges = await Challenge.find({ challenged: user.username });
      challenges = challenges.map((challenge) => {
        let { id, challenged, challenger, color, roomID, timeLimit } =
          challenge;
        return { id, challenged, challenger, color, roomID, timeLimit };
      });
      console.log(challenges);
      res.status(200).json(challenges);
    } catch (err) {
      next(err);
    }
  }
);

// ??
// TO BE TESTED
// TODO: add some logic to notify the challenger if the challenged user declines the challenge
// accept or decline a challenge
// challengeID here refers to the roomID associated with the challenge
router.delete("/challenges/:challengeID", checkAuth, async (req, res, next) => {
  try {
    let { challengeID } = req.params;
    let challenge = await Challenge.findById(challengeID);
    if (!challenge)
      return res.status(404).json({
        message: "Challenge not found",
        description: "Challenge ID does not exists",
      });
    await challenge.deleteOne();
    return res.status(200).json({});
  } catch (err) {
    next(err);
  }
});

// TO BE TESTED
// get history of games played by logged in user
router.get("/games", checkAuth, extractUserDetails, async (req, res, next) => {
  try {
    const { user } = req;
    let games = await user.getGames();
    if (!games) games = [];
    return res.status(200).json(games);
  } catch (err) {
    next(err);
  }
});

// TO BE TESTED
// get game details of a certain game played by logged in user
router.get(
  "/games/:gameid",
  checkAuth,
  extractUserDetails,
  async (req, res, next) => {
    try {
      let { gameid } = req.params;
      let { user } = req;
      let gameDoc = await Game.findById(gameid);

      if (!gameDoc) {
        return res.status(404).json({
          message: "Game not found",
          description: "Game id is invalid",
        });
      }

      if (
        user.id == gameDoc.white._id.toString() ||
        user.id == gameDoc.black._id.toString()
      ) {
        return res.status(200).json(gameDoc);
      } else {
        res.status(404).json({
          message: "Game not found",
          description: "Game id does not belong to the logged in user",
        });
      }
    } catch (err) {
      next(err);
    }
  }
);

// TODO
// add a game
router.post("/games", checkAuth, async (req, res, next) => {
  const gameData = req.body;
  const gameDoc = await Game.create(gameData);
  return res.json({ data: gameDoc });
});

module.exports = router;
