let logger = require('tracer').console();
let databaseMaxIndex = 0;

let database = {
  db: [],
  info: "This is the database",

  add(home, callback) {
    this.validate(home, (err, result) => {
      if (err) {
        logger.log("Error adding home: " + home);
        callback(err);
      }
      if (result) {
        home.home_id = databaseMaxIndex++;
        this.db.push(home);
        callback(undefined, home);
      }
    });
  },

  validate(home, next) {
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
        return;
      } else {
        logger.log("Validation succeeded");
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
    return /^[1-9][0-9]{3}[ ]?([A-RT-Za-rt-z][A-Za-z]|[sS][BCbcE-Re-rT-Zt-z])$/.test(
      value
    );
  },

  validatePhoneNumber(value) {
    return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(
      value
    );
  },

  checkIfHomeAlreadyExists(street, number) {
    var isInArray =
      this.db.find(function (el) {
        return el.street_name === street && el.number === number;
      }) !== undefined;
    return isInArray;
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
      const err = {
        message: "Id doesn't exist",
        errCode: 404
      };
      callback(err, undefined);
    } else {
      this.deleteHome(index, (err) => {
        if (err) {
          logger.log("Error deleting home: " + home);
          callback(err);
        }
      });

      this.validate(home, (err, result) => {
        if (err) {
          logger.log("Error adding home: " + home);
          callback(err);
        }
        if (result) {
          home.home_id = index;
          this.db.push(home);
          homeToUpdate = database.db.find((home) => home.home_id == index);
          callback(undefined, homeToUpdate);
        }
      });
    }
  },

  deleteHome(index, callback) {
    logger.log("database.deleteHome called");
    const homeToDelete = database.db.find((home) => home.home_id == index);

    if (!homeToDelete) {
      const err = {
        message: "Id doesn't exist",
        errCode: 404
      };
      callback(err);
    } else {
      database.db.splice(index, 1);
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