const response = {};

response.success = (res, status = 200, message, data = null) => {
  const apiResponse = {
    success: true,
    message,
  };

  if (data) {
    apiResponse.data = data;
  }

  return res.status(status).json(apiResponse);
};

response.error = (res, error) => {
  const apiResponse = {
    success: false,
    message: error.message || message,
    error: error.error,
  };

  return res.status(error.statusCode || 500).json(apiResponse);
};

module.exports = response;
