const importData1 = require("../json/data1.json");
const importData2 = require("../json/data2.json");
const apiRoutes = require("../routes/api.apiroutes");

exports.getLoggingHandler = function(req, res, next) {
    console.log("Generic logging handler called.")
    next();
}, (req, res, next) => {
    const reqMethod = req.method;
    const reqUrl = req.url;
    console.log("Endpoint called: " + reqMethod + " " + reqUrl);
    next();
};

exports.getHelloWorld = function(req, res) {
    res.send(importData1);
    res.status(200).json(result);
};

exports.getApiInfo = function(req, res) {
    console.log("ïnfo endpoint called");
    res.send(importData2);
    res.status(200).json(result);
};

exports.getCatchAll = function(req, res, next) {
    console.log("Catch-all endpoint called");
    next();
};

exports.getErrorOccurred = function(error, req, res, next) {
    console.log("Errorhandler called!");
    console.log(error);

    res.status(500).json({
        message: "Some error occurred",
        error,
    });
}