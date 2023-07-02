const router = require("express").Router();
const uuid = require("uuid");
const { createRoom } = require("../socket");
const { User } = require("../models/user");
const { checkAuth } = require("../util/auth");

const pendingChallenges = new Map();

// rooms can only be created through HTTP requests and destroyed only by socket.io server
// and vice versa is not true
router.post("/create", checkAuth, async (req, res, next) => {
    console.log(req.body);
    // challenger and challenged are username
    const { challenger, challenged } = req.body;

    const challengedEmail = (await User.findOne({ username: challenged })).email;
    console.log(challengedEmail);

    const roomID = uuid.v4();
    createRoom(roomID, req.body.timeLimit);

    if (pendingChallenges.has(challenged)) {
        let challenges = pendingChallenges.get(challenged);
        challenges.push(challenger);
    } else {
        pendingChallenges.set(challenged, [challenger]);
    }

    // sendEmail(
    //     challengedEmail,
    //     `Challenge from ${challenger}`,
    //     `To accept the challenge follow the link: http://192.168.136.99:5173/game/challenges/${challenged}/${roomID} \n login through: http://192.168.136.99:5173/login \n roomid:${roomID}`
    // );
    res.json({ roomID });
});

module.exports = router;
module.exports.pendingChallenges = pendingChallenges;
