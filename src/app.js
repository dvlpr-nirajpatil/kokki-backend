const express = require("express");
const cors = require("cors");
const { requestLogger, errorHandler } = require("./middlewares");
const { logger, response } = require("./core");
const helmet = require("helmet");
const compression = require("helmet");
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

app.get("/health", (req, res) => {
  return response(res, 200, "Server is Healthy");
});

app.use(errorHandler);

module.exports = app;
