module.exports = function (app) {
    const api = require("../controllers/api.homecontroller.js");

    app.post("/api/studenthome", api.addStudentHome);
    app.get("/api/studenthome", api.getStudentHomesByNameAndCity);
    app.put("/api/studenthome/:homeId", api.updateStudentHome);
    app.delete("/api/studenthome/:homeId", api.deleteStudentHome);
    app.get("/api/studenthome/:homeId", api.getById);
}