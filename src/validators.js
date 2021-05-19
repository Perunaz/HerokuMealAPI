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
  validateMeal(meal, index, next) {
    logger.trace("validateMeal called!");
    if (meal) {
      let name = meal["Name"];

      if (
        meal["Name"] == null ||
        meal["Description"] == null
      ) {
        next({
          message: "An element is missing!",
          errCode: 400
        });
      } else {
        this.checkIfMealAlreadyExists(name, index, (err, result) => {
          if (err) {
            next(err);
            return;
          }
          if (result) {
            next(undefined, meal);
          }
        })
      }
    } else {
      next({
        message: "The method did not succeed",
        errCode: 400
      });
    }
  },

  validateHome(home, next) {
    logger.trace("validateHome called!");
    logger.trace(home)
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
      } else {
        this.checkIfHomeAlreadyExists(street, number, (err, result) => {
          if (err) {
            next(err);
          } else {
            next(undefined, home);
          }
        });
      }
    } else {
      next({
        message: "The method did not succeed",
        errCode: 400
      });
    }
  },

  validatePostalCode(value) {
    logger.trace("validatePostalCode called!");
    return /^[1-9][0-9]{3}[ ]?([A-RT-Za-rt-z][A-Za-z]|[sS][BCbcE-Re-rT-Zt-z])$/.test(
      value
    );
  },

  validatePhoneNumber(value) {
    logger.trace("validatePhoneNumber called!");
    return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(
      value
    );
  },

  checkIfHomeAlreadyExists(street, number, next) {
    logger.trace("checkIfHomeAlreadyExists called!");

    pool.getConnection(function (err, connection) {
      if (err) {
        next({
          message: "checkIfHomeAlreadyExists failed!",
          error: err,
        });
        return;
      }

      // Use the connection
      connection.query("SELECT * FROM studenthome WHERE Address = \"" + street + "\" AND House_Nr = " + number, (error, results, fields) => {
        // When done with the connection, release it.
        connection.release();
        // Handle error after the release.
        if (error) {
          next({
            message: "checkIfHomeAlreadyExists failed!",
            error: error,
          });
        }
        if (results.length > 0) {
          next({
            message: "This home already exists",
            errCode: 400
          });
        } else {
          next(undefined, results);
        }
      });
    });
  },

  checkIfMealAlreadyExists(name, index, next) {
    logger.trace("checkIfMealAlreadyExists called!");

    pool.getConnection(function (err, connection) {
      if (err) {
        next({
          message: "checkIfMealAlreadyExists failed!",
          error: err
        });
      }

      // Use the connection
      connection.query("SELECT * FROM meal WHERE Name = \"" + name + "\" AND StudenthomeID = " + index, (error, results, fields) => {
        // When done with the connection, release it.
        connection.release();
        // Handle error after the release.
        if (error) {
          next({
            message: "checkIfMealAlreadyExists failed!",
            error: error
          });
        }
        if (results.length > 0) {
          next({
            message: "This meal already exists",
            errCode: 400
          });
          return;
        } else {
          next(undefined, results);
        }
      });
    });
  }
}

module.exports = validators;