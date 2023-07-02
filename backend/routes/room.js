const router = require("express").Router();
const uuid = require("uuid");
const { createRoom } = require("../socket");

router.post("/create", (req, res, next) => {
    const roomID = uuid.v4();
    createRoom(roomID);
    res.json({ roomID });
});

module.exports = router;
