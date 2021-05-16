const database = require("../dao/database");
let logger = require('tracer').console();

exports.getById = function (req, res, next) {
  logger.log("getById called");
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
        status: "success",
        result: result
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
        status: "success",
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

  database.getByNameAndCity(name, city, (err, result) => {
    if (err) {
      next(err);
    }
    if (result) {
      res.status(200).json({status: "success",
                            result: result});
    }
  });
};

exports.deleteStudentHome = function(req, res, next) {
  logger.log("deleteStudentHome called");
  const homeId = req.params.homeId;

  database.deleteHome(homeId, (err, result) => {
    if (err) {
      next(err);
    }
    if (result) {
      res.status(200).json({status: "success",
                            result: result});
    }
  });
}