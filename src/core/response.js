const response = (res, status, message, data = null, error = null) => {
  const apiResponse = {
    status,
    message,
  };

  if (data) {
    apiResponse.data = data;
  }

  if (error) {
    apiResponse.error = error;
  }

  return res.status(status).json(apiResponse);
};

module.exports = response;
