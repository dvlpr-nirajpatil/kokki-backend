const validate = (schema) => {
  return (req, res, next) => {
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
