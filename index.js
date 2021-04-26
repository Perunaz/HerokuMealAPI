const express = require("express");
require('./routes')(express);
const database = require("./database");

const app = express();
const importData1 = require("./data1.json");
const importData2 = require("./data2.json");
let port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`)
});