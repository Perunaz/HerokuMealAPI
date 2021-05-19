module.exports = function (app) {
    const api = require("../controllers/api.mealcontroller.js");
    const authController = require('../controllers/api.authenticationcontroller.js');

    app.post("/api/studenthome/:homeId/meal", authController.validateToken, api.addMeal);
    app.get("/api/studenthome/:homeId/meal", api.getMeals);
    app.get("/api/studenthome/:homeId/meal/:mealId", api.getMeal);
    app.put("/api/studenthome/:homeId/meal/:mealId", authController.validateToken, api.updateMeal);
    app.delete("/api/studenthome/:homeId/meal/:mealId", authController.validateToken, api.deleteMeal);

}