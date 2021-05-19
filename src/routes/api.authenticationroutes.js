module.exports = function (app) {
    const api = require('../controllers/api.authenticationcontroller.js');

    app.post("/api/login", api.validateLogin, api.login);
    app.post("/api/register", api.validateRegister, api.register);
    app.get("/api/validate", api.validateToken, api.renewToken);
}