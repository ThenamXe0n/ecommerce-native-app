class ApiResponse {
  constructor(statusCode, message, data = null) {
    this.success = statusCode < 400;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}

const sendSuccess = (
  res,
  message = "Success",
  data = null,
  statusCode = 200
) => {
  return res
    .status(statusCode)
    .json(new ApiResponse(statusCode, message, data));
};

const sendError = (
  res,
  message = "Something went wrong",
  statusCode = 500
) => {
  return res
    .status(statusCode)
    .json(new ApiResponse(statusCode, message));
};

module.exports = {
  sendSuccess,
  sendError,
};