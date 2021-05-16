const validators = require("../validators");
const mysql = require('mysql');
const logger = require('../config/config').logger;
const dbconfig = require('../config/config').dbconfig;

const pool = mysql.createPool(dbconfig);

pool.on('connection', function (connection) {
  logger.trace('Database connection established')
})

pool.on('acquire', function (connection) {
  logger.trace('Database connection aquired')
})

pool.on('release', function (connection) {
  logger.trace('Database connection released')
})

let database = {
  db: [],

  add(home, next) {
    logger.trace("add called");

    validators.validateHome(home, (err, result) => {
      if (err) {
        next(err);
      }
    });

    pool.getConnection(function (err, connection) {
      if (err) {
        res.status(400).json({
          message: "Add failed!",
          error: err,
        });
      }
   
      // Use the connection
      connection.query("INSERT INTO studenthome (Name, Address, House_Nr, UserID, Postal_Code, Telephone, City) VALUES (\""  + home.Name + "\", \"" + home.Address + "\", " + home.House_Nr + ", " + home.UserID + ", \"" + home.Postal_Code + "\", " + home.Telephone + ", \"" + home.City + "\")", (error, results, fields) => {
        // When done with the connection, release it.
        connection.release();
        // Handle error after the release.
        if (error) {
          next({
            message: error.toString(),
            errCode: 404,
          });
        }else {
          next(undefined, results);
        }
      });
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

    if (!mealToReturn) {
      callback({
        message: "mealId " + mealId + " not found!",
        errCode: 404
      });
    } else {
      callback(undefined, mealToReturn);
    }
  },

  getByNameAndCity(name, city, next) {
    logger.trace("database.getByNameAndCity called");
    pool.getConnection(function (err, connection) {
      if (err) {
        res.status(400).json({
          message: "getByNameAndCity failed!",
          error: err,
        });
      }

      let sqlQuery = "SELECT * FROM studenthome";

      if (name && city) {
        sqlQuery = "SELECT * FROM studenthome WHERE Name = \"" + name + "\" AND City = \"" + city + "\"";
      } else if (name) {
        sqlQuery = "SELECT * FROM studenthome WHERE Name = \"" + name + "\"";
      } else if (city) {
        sqlQuery = "SELECT * FROM studenthome WHERE City = \"" + city + "\"";
      }
   
      logger.trace(sqlQuery);
      // Use the connection
      connection.query(sqlQuery, (error, results, fields) => {
        // When done with the connection, release it.
        connection.release();
        // Handle error after the release.
        if (error) {
          next({
            message: error.toString(),
            errCode: 404,
          });
        }
        if (results.length > 0) {
          next(undefined, results);
        } else {
          next({
            message: "Home doesn't exist",
            errCode: 404,
          });
        }
      });
    });
  },

  getById(index, next) {
    pool.getConnection(function (err, connection) {
      if (err) {
        res.status(400).json({
          message: "GetById failed!",
          error: err,
        });
      }
   
      // Use the connection
      connection.query("SELECT * FROM studenthome WHERE ID = " + index, (error, results, fields) => {
        // When done with the connection, release it.
        connection.release();
        // Handle error after the release.
        if (error) {
          next({
            message: error.toString(),
            errCode: 404,
          });
        }
        if (results.length > 0) {
          next(undefined, results);
        } else {
          next({
            message: "Home doesn't exist",
            errCode: 404,
          });
        }
      });
    });
  },

  updateHome(index, home, next) {
    logger.trace("database.updateHome called");

    pool.getConnection(function (err, connection) {
      if (err) {
        res.status(400).json({
          message: "updateHome failed!",
          error: err,
        });
      }

      let sqlQueryBase = "UPDATE studenthome SET ";
      let name = "";
      let address = "";
      let homeNr = "";
      let postalCode = "";
      let telephone = "";
      let city = "";

      if (home.Name) {
        name = "Name = \"" + home.Name + "\", ";
      }
      if (home.Address) {
        address = "Address = \"" + home.Address + "\", ";
      }
      if (home.House_Nr) {
        homeNr = "House_Nr = \"" + home.House_Nr + "\", ";
      }
      if (home.Postal_Code) {
        postalCode = "Postal_Code = \"" + home.Postal_Code + "\", ";
      }
      if (home.Telephone) {
        telephone = "Telephone = \"" + home.Telephone + "\", ";
      }
      if (home.City) {
        city = "City = \"" + home.City + "\" ";
      }

      if (home.Postal_Code && !validators.validatePostalCode(home.Postal_Code)) {
        next({
          message: "Postal code is invalid",
          errCode: 400,
        });
        return;
      } else if (home.Telephone && !validators.validatePhoneNumber(home.Telephone)) {
        next({
          message: "Phonenumber is invalid",
          errCode: 400,
        });
        return;
      }

      let sqlQueryBase2 = sqlQueryBase.concat(name, address, homeNr, postalCode, telephone, city);
      sqlQueryBase2 = sqlQueryBase2.replace(/,\s*$/, "");
      let sqlQuery = sqlQueryBase2.concat(" WHERE ID = " + index);
   
      // Use the connection
      connection.query(sqlQuery, (error, results, fields) => {
        // When done with the connection, release it.
        connection.release();
        // Handle error after the release.
        if (error) {
          next({
            message: error.toString(),
            errCode: 404,
          });
        }
        else if (results.affectedRows == 0) {
          next({
            message: "Home doesn't exist",
            errCode: 404,
          });
        }
        else {
          next(undefined, results);
        }
      });
    });
  },

  deleteHome(index, next) {
    logger.trace("database.deleteHome called");
    
    pool.getConnection(function (err, connection) {
      if (err) {
        res.status(400).json({
          message: "deleteHome failed!",
          error: err,
        });
      }
   
      // Use the connection
      connection.query("DELETE FROM studenthome WHERE ID = " + index, (error, results, fields) => {
        // When done with the connection, release it.
        connection.release();
        // Handle error after the release.
        if (error) {
          next({
            message: error.toString(),
            errCode: 404,
          });
        }
        else if (results.affectedRows == 0) {
          next({
            message: "Home doesn't exist",
            errCode: 404,
          });
        }
        else {
          next(undefined, results);
        }
      });
    });
  },

  updateMeal(meal, homeId, mealId, callback) {
    logger.log("database.updateMeal called");
    const homeToUpdateMealFrom = database.db.find((home) => home.home_id == homeId);
    let mealToUpdate = homeToUpdateMealFrom.meals.find((meal) => meal.meal_id == mealId);

    if (!homeToUpdateMealFrom) {
      err = {
        message: "HomeId " + homeId + " not found",
        errCode: 404
      }
      callback(err);
    }
    if (!mealToUpdate) {
      err = {
        message: "mealId " + mealId + " not found!",
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
    mealToUpdate = homeToUpdateMealFrom.meals.find((meal) => meal.meal_id == mealId);
    callback(undefined, mealToUpdate);
  },

  deleteMeal(homeId, mealId, callback) {
    logger.log("database.deleteMeal called");
    const homeToDeleteMealFrom = database.db.find((home) => home.home_id == homeId);
    const mealToDelete = homeToDeleteMealFrom.meals.find((meal) => meal.meal_id == mealId);

    if (!homeToDeleteMealFrom || !mealToDelete) {
      const err = {
        message: "mealId " + mealId + " not found!",
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

module.exports = database, pool;