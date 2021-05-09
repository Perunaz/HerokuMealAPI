const database = require("../dao/database");
let logger = require('tracer').console();

exports.addMeal = function (req, res, next) {
    logger.log("addMeal called");
    const meal = req.body;
    const index = req.params.homeId;
  
    database.addMeal(meal, index, (err, result) => {
      if (err) {
        next(err);
      }
      if (result) {
        res.status(200).json({
          status: "success",
          result: result
        });
      }
    });
  };

  exports.getMeals = function (req, res, next) {
    logger.log("getMeals called");
    const index = req.params.homeId;
  
    database.getMeals(index, (err, result) => {
      if (err) {
        next(err);
      }
      if (result) {
        res.status(200).json({
          result: result
        });
      }
    });
  };

  exports.getMeal = function (req, res, next) {
    logger.log("getMeal called");
    const homeId = req.params.homeId;
    const mealId = req.params.mealId;
  
    database.getMeal(homeId, mealId, (err, result) => {
      if (err) {
        next(err);
      }
      if (result) {
        res.status(200).json({
          result: result
        });
      }
    });
  };

  exports.updateMeal = function (req, res, next) {
    logger.log("updateMeal called");
    const homeId = req.params.homeId;
    const mealId = req.params.mealId;
    const meal = req.body;
  
    database.updateMeal(meal, homeId, mealId, (err, result) => {
      if (err) {
        next(err);
      }
      if (result) {
        res.status(200).json({
          result: result
        });
      }
    });
  };

  exports.deleteMeal = function (req, res, next) {
    logger.log("deleteMeal called");
    const homeId = req.params.homeId;
    const mealId = req.params.mealId;
  
    database.deleteMeal(homeId, mealId, (err, result) => {
      if (err) {
        next(err);
      }
      if (result) {
        res.status(200).json({
          result: result
        });
      }
    });
  };