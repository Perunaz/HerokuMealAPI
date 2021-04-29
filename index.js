const express = require("express");
const database = require("./src/dao/database");

const app = express();
require('./src/routes/api.apiroutes.js')(app);
require('./src/routes/api.homeroutes.js')(app);
let port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`)
});