const importData1 = require("../json/data1.json");
const importData2 = require("../json/data2.json");
const apiRoutes = require("../routes/api.apiroutes");
let logger = require('tracer').console();

exports.getLoggingHandler = function (req, res, next) {
    logger.log("Generic logging handler called.")
    next();
}, (req, res, next) => {
    const reqMethod = req.method;
    const reqUrl = req.url;
    console.log("Endpoint called: " + reqMethod + " " + reqUrl);
    next();
};

exports.getHelloWorld = function (req, res) {
    res.status(200).json(importData1);
};

exports.getApiInfo = function (req, res) {
    logger.log("info endpoint called");
    res.status(200).json(importData2);
};

exports.getCatchAll = function (req, res, next) {
    logger.log("Catch-all endpoint called");
    next();
};