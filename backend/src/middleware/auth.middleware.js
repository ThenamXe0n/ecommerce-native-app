const jwt = require("jsonwebtoken");
const User = require("../model/User");
const ApiError = require("../utils/apiError");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ApiError(401, "Unauthorized. Access token missing"));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    const user = await User.findById(decoded.id).select(
      "-password -refreshToken",
    );

    if (!user) {
      return next(new ApiError(401, "User not found"));
    }

    req.user = user;

    next();
  } catch (error) {
    next(new ApiError(401, "Invalid or expired access token"));
  }
};

module.exports = authMiddleware;
