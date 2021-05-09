module.exports = function (app) {
    const api = require("../controllers/api.mealcontroller.js");

    app.post("/api/studenthome/:homeId/meal", api.addMeal);
    app.get("/api/studenthome/:homeId/meal", api.getMeals);
    app.get("/api/studenthome/:homeId/meal/:mealId", api.getMeal);
    app.put("/api/studenthome/:homeId/meal/:mealId", api.updateMeal);
    app.delete("/api/studenthome/:homeId/meal/:mealId", api.deleteMeal);

}