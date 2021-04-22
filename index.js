const express = require("express");
const app = express();
const importData1 = require("./data1.json");
const importData2 = require("./data2.json");
let port = process.env.PORT || 3000;

app.get("/api", (req, res) => {
    res.send(importData1);
});
app.get("/api/info", (req, res) => {
    res.send(importData2);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`)
});