const validators = require("../validators");
let logger = require('tracer').console();
let databaseHomesMaxIndex = 0;


let database = {
  db: [],
  info: "This is the database",

  add(home, callback) {
    logger.log("add called");

    validators.validateHome(home, this.db, (err, result) => {
      if (err) {
        callback(err);
      }
      if (result) {
        home.meals = [];
        this.db.push(home);
        let i = 0, ln = database.db.length;
        for (i;i<ln;i++){
          database.db[i].home_id = i;
        }
        callback(undefined, home);
      }
    });
  },

  addMeal(meal, index, callback) {
    logger.log("addMeal called");
    let homeToUpdate = database.db.find((home) => home.home_id == index);

    if (!homeToUpdate) {
      err = {
        message: "HomeId " + home.homeId + " not found",
        errCode: 404
      }
      callback(err);
    }

    validators.validateMeal(meal, index, this.db, (err, result) => {
      if (err) {
        callback(err);
      }
      if (result) {
        homeToUpdate.meals.push(meal);
        let i = 0, ln = homeToUpdate.meals.length;
        for (i;i<ln;i++){
          homeToUpdate.meals[i].meal_id = i;
        }
        database.db.splice(index, 1);
        database.db.push(homeToUpdate);
        callback(undefined, meal);
      }
    });
  },

  getMeals(index, callback) {
    logger.log("database.getMeals called");
    const output = this.db.find((home) => home.home_id == index).meals;

    if (output.length <= 0) {
      callback({
        message: "No meal(s) found!",
        errCode: 404
      });
    } else {
      callback(undefined, output);
    }
  },

  getMeal(homeId, mealId, callback) {
    logger.log("database.getMeal called");
    const mealsFromHome = this.db.find((home) => home.home_id == homeId).meals;
    const mealToReturn = mealsFromHome[mealId];

    if (mealToReturn.length <= 0) {
      callback({
        message: "No meal found!",
        errCode: 404
      });
    } else {
      callback(undefined, mealToReturn);
    }
  },

  getAll(callback) {
    callback(undefined, database.db);
  },

  getById(index, callback) {
    logger.log("database.getById called");
    const homeToReturn = database.db.find((home) => home.home_id == index);

    if (!homeToReturn) {
      const err = {
        message: "Id doesn't exist",
        errCode: 404
      };
      callback(err, undefined);
    }
    callback(undefined, homeToReturn);
  },

  updateHome(index, home, callback) {
    logger.log("database.updateHome called");
    let homeToUpdate = database.db.find((home) => home.home_id == index);

    if (!homeToUpdate) {
      err = {
        message: "HomeId " + index + " not found",
        errCode: 404
      }
      callback(err);
    }
    validators.validateHome(home, this.db, (err, result) => {
      if (err) {
        callback(err);
      }
      if (result) {
        this.deleteHome(index, (err) => {
          if (err) {
            callback(err);
          }
        });
      }
    });

    home.home_id = parseInt(index);
    this.db.push(home);
    homeToUpdate = database.db.find((home) => home.home_id == index);
    callback(undefined, homeToUpdate);
  },

  deleteHome(index, callback) {
    logger.log("database.deleteHome called");
    const homeToDelete = database.db.find((home) => home.home_id == index);

    if (!homeToDelete) {
      err = {
        message: "HomeId " + index + " not found",
        errCode: 404
      }
      callback(err);
    } else {
      database.db.splice(index, 1);
      let i = 0, ln = database.db.length;
        for (i;i<ln;i++){
          database.db[i].home_id = i;
        }
      callback(undefined, "deleted");
    }
  },

  updateMeal(meal, homeId, mealId, callback) {
    logger.log("database.updateMeal called");
    const homeToUpdateMealFrom = database.db.find((home) => home.home_id == homeId);

    if (!homeToUpdateMealFrom) {
      err = {
        message: "HomeId " + home.homeId + " not found",
        errCode: 404
      }
      callback(err);
    }
    validators.validateMeal(meal, homeId, this.db, (err, result) => {
      if (err) {
        callback(err);
      }
      if (result) {
        homeToUpdateMealFrom.meals.splice(mealId, 1);
        meal.meal_id = parseInt(mealId);
        homeToUpdateMealFrom.meals.push(meal);
        database.db.splice(homeId, 1);
        database.db.push(homeToUpdateMealFrom);
      }
    });
    const mealToUpdate = homeToUpdateMealFrom.meals.find((meal) => meal.meal_id == mealId);
    callback(undefined, mealToUpdate);
  },

  deleteMeal(homeId, mealId, callback) {
    logger.log("database.deleteMeal called");
    const homeToDeleteMealFrom = database.db.find((home) => home.home_id == homeId);
    const mealToDelete = homeToDeleteMealFrom.meals.find((meal) => meal.meal_id == mealId);

    if (!homeToDeleteMealFrom || !mealToDelete) {
      const err = {
        message: "Id doesn't exist",
        errCode: 404
      };
      callback(err);
    } else {
      homeToDeleteMealFrom.meals.splice(mealId, 1);
        let i = 0, ln = homeToDeleteMealFrom.meals.length;
        for (i;i<ln;i++){
          homeToDeleteMealFrom.meals[i].meal_id = i;
        }
        database.db.splice(homeId, 1);
        database.db.push(homeToDeleteMealFrom);

      callback(undefined, "deleted");
    }
  },
};

const home = {
  name: "Studenthuis1",
  street_name: "Rembrandtlaan",
  number: 28,
  postal_code: "1234AB",
  city: "Breda",
  phone_number: "0628283414"
};

database.add(home, (err, result) => {
  logger.log("Added single item: ", result);
});

module.exports = database;