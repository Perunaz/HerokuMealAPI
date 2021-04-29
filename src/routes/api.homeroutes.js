module.exports = function(app){
    const api = require("../controllers/api.homecontroller.js");
    const database = require("../dao/database.js");

    app.get("/api/studenthome/:homeId", api.getById);
}