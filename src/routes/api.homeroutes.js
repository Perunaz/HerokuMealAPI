module.exports = function(app){
    const api = require("../controllers/api.homecontroller.js");
    
    app.post("/api/studenthome", api.addStudentHome);
    app.get("/api/studenthome", api.getStudentHomesByNameAndCity);
    app.get("/api/studenthome/:homeId", api.getById);
}