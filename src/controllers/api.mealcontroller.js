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
    logger.log("getMeal called");
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