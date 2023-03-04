const { sign } = require("jsonwebtoken");
// const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const generateRefreshToken = (payload) => {
  const secret = process.env.REFRESH_TOKEN;
  const token = sign(payload, secret, { expiresIn: "30d" });
  return token;
};
const setAccessTokenCookie = (res, token) => {
  res.cookie("accessToken", token, {
    httpOnly: true,
    secure: true,
  });
};

const setRefreshTokenCookie = (res, token) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: true,
  });
};
const generateAccessToken = (payload) => {
  return sign(payload, process.env.ACCESS_TOKEN, {
    expiresIn: "5m",
  });
};

module.exports = {
  generateRefreshToken,
  setRefreshTokenCookie,
  generateAccessToken,
  setAccessTokenCookie,
};
