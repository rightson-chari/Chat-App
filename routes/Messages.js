const router = require("express").Router();
const Messages = require("../Models/Messages");
router.post("/", async(req, res) => {
    const newMsg = await Messages.create(req.body);

    res.status(200).json(newMsg);
});
router.post("/all", async(req, res) => {
    const { from, to } = req.body;
    const data = await Messages.find({
        users: {
            $all: [from, to],
        },
    });
    res.status(200).json(data);
});
module.exports = router;