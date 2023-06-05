var DataTypes = require("sequelize").DataTypes;

var _restaurant = require("./restaurant");
function initModels(sequelize) {

  var restaurant = _restaurant(sequelize, DataTypes);
  return {
    restaurant,
    };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
