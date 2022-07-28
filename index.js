const express = require("express");
require("express-async-errors");
const { connect } = require("mongoose");
const { notFound, errorHandler } = require("./Middlewares/not-found.js");
const app = express();
const server = require("http").createServer(app);
const message = require("./routes/Messages");
const auth = require("./routes/Register.js");
const port = process.env.PORT || 5100;
const socket = require("socket.io");

app.use(express.json());
app.use("/api/v1/auth", auth);
app.use("/api/v1/msgs", message);
app.use(notFound);
app.use(errorHandler);
const start = async() => {
    try {
        await connect(
            "mongodb+srv://Rightson:Rightson@nodeexpressproject.afbca.mongodb.net/chat"
        );
        console.log("connected");
    } catch (e) {
        console.log(e);
    }
};

server.listen(port, start);

const io = socket(server, {
    cors: {
        origin: "*",
        credentials: true,
    },
});

let users = [];

const addUser = (id, socketId) => {
    !users.some((item) => item.id === id) && users.push({ id, socketId });
};
const findUser = (data) => users.find((item) => item.id === data.to);

io.on("connection", (socket) => {
    socket.on("add", (id) => {
        addUser(id, socket.id);
    });

    socket.on("disconnect", () => {
        users = users.filter((user) => user.socketId !== socket.id);
    });

    socket.on("msg", (data) => {
        const user = findUser(data);
        console.log(data);
        if (user) {
            socket.to(user.socketId).emit("new", data);
        }
    });
});
console.log(users);