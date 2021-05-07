const database = require("../dao/database");
let logger = require('tracer').console();

exports.getById = function (req, res, next) {
  logger.log("Get student home by Id called");
  const homeId = req.params.homeId;

  database.getById(homeId, (err, result) => {
    if (err) {
      next({
        message: "HomeId " + homeId + " not found",
        errCode: 404
      });
    }
    if (result) {
      res.status(200).json({
        result: result,
      });
    }
  });
};

exports.updateStudentHome = function(req, res, next) {
  const homeId = req.params.homeId;
  const home = req.body;

  database.updateHome(homeId, home, (err, result) => {
    if (err) {
      next(err);
    }
    if (result) {
      res.status(200).json({
        result: result,
      });
    }
  });
}

exports.addStudentHome = function (req, res, next) {
  logger.log("AddStudentHome called");
  const home = req.body;

  database.add(home, (err, result) => {
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

exports.getStudentHomesByNameAndCity = function (req, res, next) {
  logger.log("getStudentHomesByNameAndCity called");
  const {
    name
  } = req.query;
  const {
    city
  } = req.query;

  console.log(name + " " + city);

  var filter1;
  var filter2;

  if (name || city) {
    if (name) {
      filter1 = database.db.filter((filter1) => filter1.name.startsWith(name))
      if (filter1.length == 0) {
        next({
          message: "Name not found",
          errCode: 404
        });
      }
    }

    if (city) {

      if (filter1 != null) {
        filter2 = filter1.filter((filter2) => filter2.city == city);
        if (filter2.length == 0) {
          next({
            message: "City not found",
            errCode: 404
          });
        }
      } else {
        filter2 = database.db.filter((filter2) => filter2.city == city);
        if (filter2.length == 0) {
          next({
            message: "City not found",
            errCode: 404
          });
        }
      }
    }

    if (filter2 != null) {
      res.status(200).json(filter2);
    } else {
      if (filter1 != null) {
        res.status(200).json(filter1);
      } else {
        next({
          message: "Not found",
          errCode: 404
        });
      }
    }
  } else {
    res.status(200).json(database.db);
  }
};

exports.deleteStudentHome = function(req, res, next) {
  logger.log("deleteStudentHome called");
  const homeId = req.params.homeId;

  database.deleteHome(homeId, (err, result) => {
    if (err) {
      next(err);
    }
    if (result) {
      res.status(200).json({status: "success deleting home: " + result});
    }
  });
}