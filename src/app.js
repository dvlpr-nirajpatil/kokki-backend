const express = require("express");
const cors = require("cors");
const { requestLogger, errorHandler } = require("./middlewares");
const { response, logger } = require("./core");
const helmet = require("helmet");
const compression = require("compression");
const corsOptions = require("./config/cors");


const app = express();

app.use(helmet());

app.use(
  compression({
    threshold: 1024,
  }),
);

app.use(cors(corsOptions));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(requestLogger);

app.use("/api/v1", require("./router/v1.router"));

app.get("/health", (req, res) => {
  logger.error("Something Went Wrong With The Application!");
  console.log("Something went wrong");
  console.info("Something went wrong");
  return response.success(res, 200, "Server is Healthy");
});

app.use(errorHandler);

module.exports = app;
