const express = require("express");
const database = require("./database");

const app = express();
const importData1 = require("./data1.json");
const importData2 = require("./data2.json");
let port = process.env.PORT || 3000;

app.all("*", (req, res, next) => {
    console.log("Generic logging handler called.")
    next();
}, (req, res, next) => {
    const reqMethod = req.method;
    const reqUrl = req.url;
    console.log("Endpoint called: " + reqMethod + " " + reqUrl);
    next();
});

app.get("/api", (req, res) => {
    res.send(importData1);
    res.status(200).json(result);
});

app.get("/api/info", (req, res) => {
    console.log("ïnfo endpoint called");
    res.send(importData2);
    res.status(200).json(result);
});

app.all("*", (req, res, next) => {
    console.log("Catch-all endpoint called");
    next();
})

app.use("*", (error, req, res, next) => {
    console.log("Errorhandler called!");
    console.log(error);

    res.status(500).json({
        message: "Some error occurred",
        error,
    });
})


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`)
});