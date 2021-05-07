const express = require("express");
const bodyParser = require("body-parser");
let logger = require('tracer').console();

const app = express();
app.use(bodyParser.json());
require('./src/routes/api.apiroutes.js')(app);
require('./src/routes/api.homeroutes.js')(app);
require('./src/routes/api.mealroutes.js')(app);
let port = process.env.PORT || 3000;

app.use((error, req, res, next) => {
    logger.log("Errorhandler called! ", error);
    res.status(error.errCode).json({
        error: "some error occured",
        message: error.message,
    });
});

app.listen(port, () => {
    logger.log(`Server running at http://localhost:${port}/`)
});

module.exports = app;