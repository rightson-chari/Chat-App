const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");
const string = {
    type: String,
    required: true,
};
const UserSchema = new Schema({
    username: {
        ...string,
        min: 3,
        max: 20,
        unique: true,
    },
    email: {
        ...string,
        max: 50,
        unique: true,
    },
    password: {
        ...string,
        min: 6,
    },
    isAvatarImageSet: {
        type: Boolean,
        default: false,
    },
    avatarImage: {
        type: String,
        default: "",
    },
});
UserSchema.pre("save", async function() {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});
UserSchema.methods.verifyPassword = async function(candidate) {
    return await bcrypt.compare(candidate, this.password);
};
module.exports = model("User", UserSchema);