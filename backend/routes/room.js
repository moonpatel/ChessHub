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
    // challenger and challenged are username, color is the color played by challenger, timeLimit is the timeLimit for one player
    const { challenger, challenged, color, timeLimit } = req.body;

    // get email of the challenged person
    // const challengedEmail = (await User.findOne({ username: challenged })).email;
    // console.log(challengedEmail);

    const roomID = uuid.v4();
    createRoom(roomID, timeLimit);

    // create a challenge and add it to pendingChallenges to notify the challenged user
    // structure of challenge: {challenger,roomID,color,timeLimit}
    if (pendingChallenges.has(challenged)) {
        let challenges = pendingChallenges.get(challenged);
        challenges.push({ challenger, roomID, color, timeLimit });
    } else {
        // color is the choosed by the challenger
        pendingChallenges.set(challenged, [{ challenger, roomID, color, timeLimit }]);
    }

    console.log("Pending challenges", pendingChallenges);

    // STOP SENDING EMAILS FOR NOW
    // sendEmail(
    //     challengedEmail,
    //     `Challenge from ${challenger}`,
    //     `To accept the challenge follow the link: http://192.168.136.99:5173/game/challenges/${challenged}/${roomID} \n login through: http://192.168.136.99:5173/login \n roomid:${roomID}`
    // );
    res.json({ roomID });
});

module.exports = router;
module.exports.pendingChallenges = pendingChallenges;
