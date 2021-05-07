let logger = require('tracer').console();
let databaseHomesMaxIndex = 0;


let database = {
  dbHomes: [],
  info: "This is the database",

  add(home, callback) {
    logger.log("add called");

    this.validateHome(home, (err, result) => {
      if (err) {
        callback(err);
      }
      if (result) {
        home.home_id = databaseHomesMaxIndex++;
        home.meals = [];
        this.dbHomes.push(home);
        callback(undefined, home);
      }
    });
  },

  addMeal(meal, index, callback) {
    logger.log("addMeal called");
    let homeToUpdate = database.dbHomes.find((home) => home.home_id == index);

    if (!homeToUpdate) {
      err = {
        message: "HomeId " + home.homeId + " not found",
        errCode: 404
      }
      callback(err);
    }

    this.validateMeal(meal, index, (err, result) => {
      if (err) {
        callback(err);
      }
      if (result) {
        this.dbHomes[index]['meals'].push(meal);
        callback(undefined, meal);
      }
    });
  },

  getMeals(index, callback) {
    const output = this.dbHomes.find((home) => home.home_id == index).meals;
    logger.log(output);

    if (output.length <= 0) {
      callback({
        message: "No meal(s) found!",
        errCode: 404
      });
    } else {
      callback(undefined, output);
    }
  },

  validateMeal(meal, index, next) {
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
      } else if (this.checkIfMealAlreadyExists(name, index)) {
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
    var isInArray =
      this.dbHomes.find(function (x) {
        return x.street_name === street && x.number === number;
      }) !== undefined;
    return isInArray;
  },

  checkIfMealAlreadyExists(name, index) {
    logger.log("checkIfMealAlreadyExists called!");

    let homeToUpdate = database.dbHomes.find((home) => home.home_id == index);
    let meals = homeToUpdate.meals;
    let mealToReturn = meals.find((meal) => meal.name == name);

    if (!mealToReturn) {
      return false;
    } else {
      return true;
    }
  },

  getAll(callback) {
    callback(undefined, database.dbHomes);
  },

  getById(index, callback) {
    logger.log("database.getById called");
    const homeToReturn = database.dbHomes.find((home) => home.home_id == index);

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
    let homeToUpdate = database.dbHomes.find((home) => home.home_id == index);

    if (!homeToUpdate) {
      err = {
        message: "HomeId " + home.homeId + " not found",
        errCode: 404
      }
      callback(err);
    }
    this.validateHome(home, (err, result) => {
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
    this.dbHomes.push(home);
    homeToUpdate = database.dbHomes.find((home) => home.home_id == index);
    callback(undefined, homeToUpdate);
  },

  deleteHome(index, callback) {
    logger.log("database.deleteHome called");
    const homeToDelete = database.dbHomes.find((home) => home.home_id == index);

    if (!homeToDelete) {
      const err = {
        message: "Id doesn't exist",
        errCode: 404
      };
      callback(err);
    } else {
      database.dbHomes.splice(index, 1);
      callback(undefined, index);
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