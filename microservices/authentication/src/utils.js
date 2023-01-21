const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { UserSchema } = require("app-models");
const secret = "some secret";
const UserModel = mongoose.model("User", UserSchema);

function getJwtTokenFromCookie(request) {
  const cookies = request.headers.cookie;
  let jwtToken = null;
  if (cookies) {
    cookies.split(";").forEach((cookie) => {
      const [key, value] = cookie.split(/=(.*)/s);
      if (String(key).trim() === "jwtToken") {
        jwtToken = String(value).trim();
      }
    });
  }
  return jwtToken;
}

function generateAccessToken(user) {
  return jwt.sign(user, secret, { expiresIn: "15m" });
}

const URLS = {
  GET_BOARD_ACCESS_DETAILS: `http://board:3000/api/v1/board/getusers/:boardname`,
};

const getErrorMessage = (error) => error.response?.data?.error || error.message;

module.exports = {
  getJwtTokenFromCookie,
  generateAccessToken,
  getErrorMessage,
  UserModel,
  URLS,
};
