const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const secret = "some secret";

async function getUserIdFromCookie(request) {
  const jwtToken = getJwtTokenFromCookie(request);
  const decodedToken = await jwt.verify(jwtToken, secret);
  return decodedToken._id;
}
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

module.exports = {
  getUserIdFromCookie
};

