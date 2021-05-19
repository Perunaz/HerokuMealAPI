module.exports = function (app) {
    const api = require("../controllers/api.homecontroller.js");
    const authController = require('../controllers/api.authenticationcontroller.js');

    app.post("/api/studenthome", authController.validateToken, api.addStudentHome);
    app.get("/api/studenthome", api.getStudentHomesByNameAndCity);
    app.put("/api/studenthome/:homeId", authController.validateToken, api.updateStudentHome);
    app.delete("/api/studenthome/:homeId", authController.validateToken, api.deleteStudentHome);
    app.get("/api/studenthome/:homeId", api.getById);
}