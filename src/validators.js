const mysql = require('mysql');
const logger = require('./config/config').logger;
const dbconfig = require('./config/config').dbconfig;

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

let validators = {
    validateMeal(meal, index, db, next) {
        logger.log("validateMeal called!");
        if (meal) {
          let name = meal["name"];
    
          if (
            meal["name"] == null ||
            meal["info"] == null
          ) {
            next({
              message: "An element is missing!",
              errCode: 400
            });
          } else if (this.checkIfMealAlreadyExists(name, index, db)) {
            next({
              message: "This meal already exists",
              errCode: 400
            });
          } else {
            next(undefined, meal);
          }
        } else {
          next({
            message: "The method did not succeed",
            errCode: 400
          });
        }
      },
    
      validateHome(home, next) {
        logger.log("validateHome called!");
        if (home) {
          let postalCode = home["Postal_Code"];
          let phoneNumber = home["Telephone"];
          let street = home["Address"];
          let number = home["House_Nr"];
    
          if (
            home["Name"] == null ||
            home["Address"] == null ||
            home["House_Nr"] == null ||
            home["Postal_Code"] == null ||
            home["City"] == null ||
            home["Telephone"] == null
          ) {
            next({
              message: "An element is missing!",
              errCode: 400
            });
          } else if (!this.validatePostalCode(postalCode)) {
            next({
              message: "Postal code is invalid",
              errCode: 400
            });
          } else if (!this.validatePhoneNumber(phoneNumber)) {
            next({
              message: "Phonenumber is invalid",
              errCode: 400
            });
          } else if (this.checkIfHomeAlreadyExists(street, number)) {
            next({
              message: "This studenthome already exists",
              errCode: 400
            });
          } else {
            next(undefined, home);
          }
        } else {
          next({
            message: "The method did not succeed",
            errCode: 400
          });
        }
      },
    
      validatePostalCode(value) {
        logger.log("validatePostalCode called!");
        return /^[1-9][0-9]{3}[ ]?([A-RT-Za-rt-z][A-Za-z]|[sS][BCbcE-Re-rT-Zt-z])$/.test(
          value
        );
      },
    
      validatePhoneNumber(value) {
        logger.log("validatePhoneNumber called!");
        return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(
          value
        );
      },
    
      checkIfHomeAlreadyExists(street, number) {
        logger.log("checkIfHomeAlreadyExists called!");
        
        pool.getConnection(function (err, connection) {
          if (err) {
            res.status(400).json({
              message: "GetById failed!",
              error: err,
            });
          }
       
          // Use the connection
          connection.query("SELECT * FROM studenthome WHERE Address = " + street + " AND House_Nr = " + number, (error, results, fields) => {
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
              return false;
            } else {
              return true;
            }
          });
        });
      },
    
      checkIfMealAlreadyExists(name, index, db) {
        logger.log("checkIfMealAlreadyExists called!");
    
        let homeToUpdate = db.find((home) => home.home_id == index);
        let meals = homeToUpdate.meals;
        let mealToReturn = meals.find((meal) => meal.name == name);
    
        if (!mealToReturn) {
          return false;
        } else {
          return true;
        }
      }
}

module.exports = validators;