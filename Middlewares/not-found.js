module.exports.errorHandler = (error, req, res, next) => {
    console.log(error);
    const custom = {
        msg: error.message || "Internal Server Error",
        status: error.status || 500,
    };
    res.status(custom.status).json(custom.msg);
};
module.exports.notFound = (req, res) =>
    res.status(404).json("Still under construction");