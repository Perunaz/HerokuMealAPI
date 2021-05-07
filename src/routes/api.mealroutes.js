module.exports = function (app) {
    const api = require("../controllers/api.mealcontroller.js");

    app.post("/api/studenthome/:homeId/meal", api.addMeal);
    app.get("/api/studenthome/:homeId/meal", api.getMeals);
}