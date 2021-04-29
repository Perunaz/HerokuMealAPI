module.exports = function(app){

    const api = require("../controllers/api.homecontroller.js");

    app.get("/api/studenthome/:homeId", api.getById);
}