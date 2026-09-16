const { logger } = require("../core");
const env = require("../config/env");


const validate = (schema) => {
  return (req, res, next) => {
    if (req.body && env.nodeEnv == "development") {
      console.log(req.body);
    }
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });


    if (!result.success) {
      const message = result.error.issues
        .map((issue) => issue.message)
        .join(", ");

      return res.status(400).json({
        success: false,
        message,
      });
    }

    req.validatedData = result.data;
    next();
  };
};

module.exports = validate;
