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
      const errors = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path.at(-1);

        if (field && !errors[field]) {
          errors[field] = issue.message;
        }
      });

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    req.validatedData = result.data;
    next();
  };
};

module.exports = validate;
