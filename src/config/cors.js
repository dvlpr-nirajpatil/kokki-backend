const env = require("./env");

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    if (env.clientUrls.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`), false);
  },

  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],

  allowedHeaders: ["Content-Type", "Authorization"],

  credentials: true,
};

module.exports = corsOptions;
