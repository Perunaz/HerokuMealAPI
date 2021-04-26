const express = require("express");
const database = require("./database");

const app = express();
require('./route/api.routes.js')(app);
let port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`)
});