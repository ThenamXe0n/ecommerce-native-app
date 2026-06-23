const bcrypt = require("bcryptjs");
const User = require("../model/User");
const ApiError = require("../utils/apiError");
const { sendSuccess } = require("../utils/apiResponse");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");
const jwt = require("jsonwebtoken")

const register = async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const payload = {
    id: user._id,
    role: user.role,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  user.refreshToken = refreshToken;
  await user.save();

  return sendSuccess(
    res,
    "User registered successfully",
    {
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
    201,
  );
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  const payload = {
    id: user._id,
    role: user.role,
  };

  const accessToken = generateAccessToken(payload);

  const refreshToken = generateRefreshToken(payload);

  user.refreshToken = refreshToken;

  await user.save();

  return sendSuccess(res, "Login successful", {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new ApiError(401, "Refresh token is required");
  }

  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

  const user = await User.findById(decoded.id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.refreshToken !== refreshToken) {
    throw new ApiError(401, "Invalid refresh token");
  }

  const accessToken = generateAccessToken({
    id: user._id,
    role: user.role,
  });

  return sendSuccess(res, "Access token refreshed", { accessToken });
};

const logout = async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, {
    refreshToken: null,
  });

  return sendSuccess(res, "Logout successful");
};

const getMe = async (req, res) => {
  return sendSuccess(res, "User fetched successfully", req.user);
};

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  getMe,
};
