const router = require("express").Router();
const uuid = require("uuid");
const { createRoom } = require("../socket");
const { sendEmail } = require("../mail");
const { User } = require("../models/user");

// rooms can only be created through HTTP requests and destroyed only by socket.io server
// and vice versan is not true

router.post("/create", async (req, res, next) => {
    // challenger and challenged are username
    const { challenger, challenged } = req.body;

    const challengedEmail = await User.findOne({ username: challenged }).email;

    const roomID = uuid.v4();
    createRoom(roomID, req.body.timeLimit);
    
    sendEmail(
        challengedEmail,
        `Challenge from ${challenger}`,
        `To accept the challenge follow the link: http://192.168.136.99:5173/game/challenges/${challenged}/${roomID} \n login through: http://192.168.136.99:5173/login \n roomid:${roomID}`
    );
    res.json({ roomID });
});

module.exports = router;
