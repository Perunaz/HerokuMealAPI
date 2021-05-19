const validators = require("../validators");
const logger = require('../config/config').logger;
const pool = require('../config/database-config');

let database = {

  add(home, userId, next) {
    logger.trace("add called");

    validators.validateHome(home, (err, result) => {
      if (err) {
        next(err);
      }
      if (result) {
        pool.getConnection(function (err, connection) {
          if (err) {
            next(err);
          }

          // Use the connection
          connection.query("INSERT INTO studenthome (Name, Address, House_Nr, UserID, Postal_Code, Telephone, City) VALUES (\"" + home.Name + "\", \"" + home.Address + "\", " + home.House_Nr + ", " + userId + ", \"" + home.Postal_Code + "\", " + home.Telephone + ", \"" + home.City + "\")", (error, results, fields) => {
            // When done with the connection, release it.
            connection.release();
            // Handle error after the release.
            if (error) {
              next({
                message: error.toString(),
                errCode: 404,
              });
            } else {
              next(undefined, results);
            }
          });
        });
      }
    });
  },

  addMeal(meal, homeId, userId, next) {
    logger.trace("addMeal called");

    validators.validateMeal(meal, homeId, (err, result) => {
      if (err) {
        next(err);
        return;
      }
      if (result) {
        pool.getConnection(function (err, connection) {
          if (err) {
            next(err);
          }

          // Use the connection
          connection.query("INSERT INTO meal (Name, Description, Ingredients, Allergies, CreatedOn, OfferedOn, Price, UserID, StudenthomeID, MaxParticipants) VALUES (\"" + meal.Name + "\", \"" + meal.Description + "\", \"" + meal.Ingredients + "\", \"" + meal.Allergies + "\", \"" + new Date() + "\", \"" + meal.OfferedOn + "\", " + meal.Price + ", " + userId + ", " + homeId + ", " + meal.MaxParticipants + ")", (error, results, fields) => {
            // When done with the connection, release it.
            connection.release();
            // Handle error after the release.
            if (error) {
              next({
                message: error.toString(),
                errCode: 404,
              });
            } else {
              next(undefined, results);
            }
          });
        });
      }
    });
  },

  getMeals(index, next) {
    logger.trace("database.getMeals called");
    pool.getConnection(function (err, connection) {
      if (err) {
        next(err);
      }
      // Use the connection
      connection.query("SELECT * FROM meal WHERE StudenthomeID = " + index, (error, results, fields) => {
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
            message: "Home doesn't have meals",
            errCode: 404,
          });
        }
      });
    });
  },

  getMeal(homeId, mealId, next) {
    pool.getConnection(function (err, connection) {
      if (err) {
        next(err);
      }

      // Use the connection
      connection.query("SELECT * FROM meal WHERE ID = " + mealId + " AND StudenthomeID = " + homeId, (error, results, fields) => {
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
            message: "Meal doesn't exist",
            errCode: 404,
          });
        }
      });
    });
  },

  getByNameAndCity(name, city, next) {
    logger.trace("database.getByNameAndCity called");
    pool.getConnection(function (err, connection) {
      if (err) {
        next(err);
      }

      let sqlQuery = "SELECT * FROM studenthome";

      if (name && city) {
        sqlQuery = "SELECT * FROM studenthome WHERE Name = \"" + name + "\" AND City = \"" + city + "\"";
      } else if (name) {
        sqlQuery = "SELECT * FROM studenthome WHERE Name = \"" + name + "\"";
      } else if (city) {
        sqlQuery = "SELECT * FROM studenthome WHERE City = \"" + city + "\"";
      }
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
        next(err);
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
        next(err);
      }

      let sqlQueryBase = "UPDATE studenthome SET ";
      let name = "";
      let address = "";
      let homeNr = "";
      let postalCode = "";
      let telephone = "";
      let city = "";

      if(!home.Name && !home.Address && !home.House_Nr && !home.Postal_Code && !home.Telephone && !home.City) {
        next({
          message: "An element is missing!",
          errCode: 400,
        });
        return;
      }

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
        } else if (results.affectedRows == 0) {
          next({
            message: "Home doesn't exist",
            errCode: 404,
          });
        } else {
          next(undefined, results);
        }
      });
    });
  },

  deleteHome(index, next) {
    logger.trace("database.deleteHome called");

    pool.getConnection(function (err, connection) {
      if (err) {
        next(err);
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
        if (results.affectedRows > 0) {
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

  updateMeal(meal, homeId, mealId, next) {
    logger.trace("database.updateMeal called");

    let sqlQueryBase = "UPDATE meal SET ";
    let name = "";
    let description = "";
    let ingredients = "";
    let allergies = "";
    let offeredOn = "";
    let price = "";
    let maxParticipants = "";

    if(!meal.Name && !meal.Description && !meal.Ingredients && !meal.Allergies && !meal.OfferedOn && !meal.Price && !meal.MaxParticipants) {
      next({
        message: "An element is missing!",
        errCode: 400,
      });
      return;
    }

    if (meal.Name) {
      name = "Name = \"" + meal.Name + "\", ";
    }
    if (meal.Description) {
      description = "Description = \"" + meal.Description + "\", ";
    }
    if (meal.Ingredients) {
      ingredients = "Ingredients = \"" + meal.Ingredients + "\", ";
    }
    if (meal.Allergies) {
      allergies = "Allergies = \"" + meal.Allergies + "\", ";
    }
    if (meal.OfferedOn) {
      offeredOn = "OfferedOn = \"" + meal.OfferedOn + "\", ";
    }
    if (meal.Price) {
      price = "Price = \"" + meal.Price + "\", ";
    }
    if (meal.MaxParticipants) {
      maxParticipants = "MaxParticipants = \"" + meal.MaxParticipants + "\" ";
    }

    let sqlQueryBase2 = sqlQueryBase.concat(name, description, ingredients, allergies, offeredOn, price, maxParticipants);
    sqlQueryBase2 = sqlQueryBase2.replace(/,\s*$/, "");
    let sqlQuery = sqlQueryBase2.concat(" WHERE ID = " + mealId + " AND StudenthomeID = " + homeId);

    pool.getConnection(function (err, connection) {
      if (err) {
        next(err);
      }

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
        if (results.affectedRows > 0) {
          next(undefined, results);
        } else {
          next({
            message: "Meal doesn't exist",
            errCode: 404,
          });
        }
      });
    });
  },

  deleteMeal(homeId, mealId, next) {
    logger.trace("database.deleteMeal called");

    pool.getConnection(function (err, connection) {
      if (err) {
        next(err);
      }

      // Use the connection
      connection.query("DELETE FROM meal WHERE ID = " + mealId + " AND StudenthomeID = " + homeId, (error, results, fields) => {
        // When done with the connection, release it.
        connection.release();
        // Handle error after the release.
        if (error) {
          next({
            message: error.toString(),
            errCode: 404,
          });
        }
        if (results.affectedRows > 0) {
          next(undefined, results);
        } else {
          next({
            message: "Meal doesn't exist",
            errCode: 404,
          });
        }
      });
    });
  },
};

module.exports = database, pool;