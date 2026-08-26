const {
  getVercelEnvironment,
  loadEnvironment,
} = require("../src/config/load-env");

if (getVercelEnvironment()) {
  loadEnvironment();
} else {
  loadEnvironment("development");
}

process.env.NODE_ENV = "test";
