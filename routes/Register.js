const router = require("express").Router();
const Custom = require("../Middlewares/Custom");
const User = require("../Models/User");
router.post("/", async(req, res) => {
    const email = await User.findOne({ email: req.body.email });
    const username = await User.findOne({ username: req.body.username });
    console.log(email);
    if (email) {
        return res.status(200).json("Email Already exists");
    }
    if (username) {
        return res.status(200).json("Username Already exists");
    }
    const newUser = await User.create(req.body);
    const { password, ...data } = newUser._doc;

    res.status(200).json(data);
});
router.post("/login", async(req, res) => {
    const loginUser = await User.findOne({ username: req.body.username });

    if (!loginUser) {
        return res.status(200).json("Wrong Username");
    }
    const verify = await loginUser.verifyPassword(req.body.password);

    if (!verify) {
        throw new Custom("Wrong Password", 200);
    }
    const { password, ...data } = loginUser._doc;

    res.status(200).json(data);
});
router.patch("/:id", async(req, res) => {
    const currentUser = await User.findOneAndUpdate({ _id: req.params.id }, { avatarImage: req.body.image, isAvatarImageSet: true }, {
        new: true,
        runValidators: true,
    });
    res.status(200).json(currentUser);
});
router.get("/:id", async(req, res) => {
    const data = await User.find({ _id: { $ne: req.params.id } }).select([
        "email",
        "username",
        "avatarImage",
        "_id",
    ]);
    res.status(200).json(data);
});
module.exports = router;