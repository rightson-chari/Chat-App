const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const string = {
    type: String,
    required: true,
};

const MessageScheme = new Schema({
    message: {
        ...string,
    },
    users: {
        type: Array,
        default: [],
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
}, { timestamps: true });

module.exports = model("Messages", MessageScheme);