const errorHandler = require("./error_handler");

module.exports = {
  requestLogger: require("./request_logger"),
  errorHandler: require("./error_handler"),
  protectRoute: require("./protect_route"),
};
