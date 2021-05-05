module.exports = function (app) {

    const api = require("../controllers/api.apicontroller.js");

    app.all("*", api.getLoggingHandler);

    app.get("/api", api.getHelloWorld);

    app.get("/api/info", api.getApiInfo);

    app.all("*", api.getCatchAll);
}