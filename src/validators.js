const database = require("./dao/database");
let logger = require('tracer').console();

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
    
      validateHome(home, db, next) {
        logger.log("validateHome called!");
        if (home) {
          let postalCode = home["postal_code"];
          let phoneNumber = home["phone_number"];
          let street = home["street_name"];
          let number = home["number"];
    
          if (
            home["name"] == null ||
            home["street_name"] == null ||
            home["number"] == null ||
            home["postal_code"] == null ||
            home["city"] == null ||
            home["phone_number"] == null
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
          } else if (this.checkIfHomeAlreadyExists(street, number, db)) {
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
    
      checkIfHomeAlreadyExists(street, number, db) {
        logger.log("checkIfHomeAlreadyExists called!");
        var isInArray =
          db.find(function (x) {
            return x.street_name === street && x.number === number;
          }) !== undefined;
        return isInArray;
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