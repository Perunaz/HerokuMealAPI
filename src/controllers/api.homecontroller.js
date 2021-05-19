const database = require("../dao/database");
const logger = require('../config/config').logger;

exports.getById = function (req, res, next) {
  logger.trace("getById called");
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
  logger.trace("AddStudentHome called");
  const home = req.body;
  const userId = req.userId;

  database.add(home, userId, (err, result) => {
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
  logger.trace("getStudentHomesByNameAndCity called");
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
  logger.trace("deleteStudentHome called");
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