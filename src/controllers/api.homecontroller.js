const apiRoutes = require("../routes/api.homeroutes");
const database = require("../dao/database");

exports.getById = function(req, res) {
    console.log("Get student home by Id called");
    const homeId = req.params.homeId;

    database.getById(homeId, (err, result) => {
      if (err) {
        next({ message: "HomeId " + homeId + " not found", errCode: 404 });
      }
      if (result) {
        res.status(200).json({
          result: result,
        });
      }
    });
};