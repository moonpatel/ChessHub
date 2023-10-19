const router = require("express").Router();
const { Challenge } = require("../models/challenge");
const { User } = require("../models/user");

// API endpoints that are publically accessible and does not require authentication

// get all users
router.get("/users", async (req, res, next) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (err) {
    next(err);
  }
});

// TO BE TESTED
// get user details
router.get("/users/:username", async (req, res, next) => {
  try {
    let username = req.params.username;
    const user = await User.findOne({ username });
    let { id, email, fname, lname, country, location } = user;
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
// get friends of given user
router.get("/users/:username/friends", async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const friends = await user.getFriends();
    return res.json({ friends });
  } catch (err) {
    next(err);
  }
});

// IS IT REQUIRED?
// TO BE TESTED
// get current challenges of the user
router.get("/users/:username/challenges", checkAuth, async (req, res, next) => {
  try {
    let { userId } = req;
    const user = await User.findById(userId);
    let challenges = await Challenge.find({ challenged: user.username });
    if (!challenges) challenges = [];
    console.log("Challenges to", user.username, challenges);
    res.json({ challenges: challenges });
  } catch (err) {
    next(err);
  }
});

// TO BE TESTED
// get history of games played
router.get("/users/:username/games", async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    let gamesData = await user.getGames();
    if (!gamesData) gamesData = [];
    return res.status(200).json(gamesData);
  } catch (err) {
    next(err);
  }
});

// TO BE TESTED
// get a particular game
router.get(
  "/users/:username/games/:gameid",
  async (req, res, next) => {
    try {
      const { gameid } = req.params;
      const gameData = await Game.findById(gameid);
      if (gameData) {
        return res.status(200).json(gameData);
      } else {
        return res.status(404).json({ error: { message: "Game not found" } });
      }
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;