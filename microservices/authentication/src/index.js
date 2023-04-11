const express = require("express");
const app = express();
const port = 3000;

const { DB_URI } = require("./config");

const mongoose = require("mongoose");
mongoose.connect(DB_URI);

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret = "some secret";

const axios = require("axios");

const ROUTES = require("./config/routes");
const setupProxies = require("./config/proxy");
const setupAuth = require("./config/authMiddleware");
const {
  getJwtTokenFromCookie,
  generateAccessToken,
  UserModel,
  URLS,
  getErrorMessage,
  getUserIdFromCookie,
} = require("./utils");

app.use(/\/api\/v1\/authentication\/.*/, express.json());

app.use((req, res, next) => {
  console.log("request received for url: " + req.originalUrl);
  next();
});

setupAuth(app, ROUTES);

// additional middlewares
app.use(/^\/wbo\/boards\/[\w%\-_~()]*$/, async (req, res, next) => {
  try {
    const boardname = req.originalUrl.substring(12);
    if (boardname === "anonymous") {
      req.headers.role = "owner";
      return next();
    }
    const boardAccessDetails = await axios.get(
      URLS.GET_BOARD_ACCESS_DETAILS.replace(":boardname", boardname)
    );
    if (boardAccessDetails.status !== 200) {
      return next(new Error(boardAccessDetails.data.error));
    }
    const { viewers, editors, owner } = boardAccessDetails.data;
    const userid = req.get("userid");
    if (userid === owner) {
      req.headers.role = "owner";
    } else if (editors.includes(userid)) {
      req.headers.role = "editor";
    } else if (viewers.includes(userid)) {
      req.headers.role = "viewer";
    } else {
      return next(new Error("You are not authorized to access this board"));
    }
    next();
  } catch (error) {
    next(error);
  }
});
// end of additional middlewares

setupProxies(app, ROUTES);

app.get("/api/v1/authentication", (req, res) => {
  res.json({
    msg: "authentication",
  });
});

app.get("/api/v1/authentication/getProfile", async (req, res, next) => {
  try {
    const UserId = await getUserIdFromCookie(req);
    const existingUser = await UserModel.findById(UserId);
    res.json(existingUser);
    return next();
  } catch (error) {
    next(error);
  }
});

app.post("/api/v1/authentication/updateProfile", async (req, res, next) => {
  try {
    const UserId = await getUserIdFromCookie(req);
    const userUpdate = {
      firstName: req.body.firstName || "",
      lastName: req.body.lastName || "",
    };
    if (req.body.image) {
      userUpdate.image = req.body.image || "";
    }
    await UserModel.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(UserId) },
      { $set: userUpdate }
    );
    res.json({
      message: "Successfully updated user profile",
    });
    return next();
  } catch (error) {
    next(error);
  }
});

app.post("/api/v1/authentication/register", async (req, res, next) => {
  try {
    const { email: username, password } = req.body;
    const existingUser = await UserModel.findOne({ username });
    if (existingUser !== null) {
      res.status(400).json({
        error: "Username in use",
      });
      return next();
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new UserModel();
    user.username = username;
    user.password = hashedPassword;
    await user.save();
    res.status(201).send({
      msg: "User registered!",
    });
    next();
  } catch (error) {
    next(error);
  }
});

app.post("/api/v1/authentication/login", async (req, res, next) => {
  try {
    const { email: username, password } = req.body;
    const user = await UserModel.findOne({ username });
    if (user === null) {
      res.status(404).json({
        error: "User does not exist!",
      });
      return next();
    }
    if (await bcrypt.compare(password, user.password)) {
      const accessToken = generateAccessToken({
        _id: user._id,
      });
      res.cookie("jwtToken", accessToken, {
        secure: true,
        maxAge: 15 * 60 * 1000,
        httpOnly: true,
      });
      res.json({
        user,
        accessToken,
      });
    } else {
      res.status(401).json({
        error: "Password Incorrect!",
      });
    }
    next();
  } catch (error) {
    next(error);
  }
});

app.post("/api/v1/authentication/logout", (req, res) => {
  res.clearCookie("jwtToken");
  res.json({
    redirectURL: "/",
  });
  res.end();
});

app.post("/api/v1/authentication/isLoggedIn", async (req, res, next) => {
  const jwtToken = getJwtTokenFromCookie(req);
  try {
    const decodedToken = await jwt.verify(jwtToken, secret);
    const starredBoards = await UserModel.findById(decodedToken._id, [
      "starred",
    ]);
    res.json(starredBoards);
  } catch (error) {
    next(error);
  }
  next();
});

app.post("/api/v1/authentication/toggleStarred/:id", async (req, res, next) => {
  const boardid = req.params.id?.trim();
  const jwtToken = getJwtTokenFromCookie(req);
  try {
    if (!boardid) {
      throw new Error("Invalid board id");
    }
    const { _id: userid } = await jwt.verify(jwtToken, secret);
    // if board is in starred list, remove it; else add it
    const user = await UserModel.findById(userid);
    if (user === null) {
      throw new Error("Invalid user id");
    }
    const boardidLocation = user.starred.findIndex(
      (id) => id.toString().localeCompare(boardid) === 0
    );
    let message;
    if (boardidLocation !== -1) {
      user.starred.splice(boardidLocation, 1);
      message = "Board removed from starred list";
    } else {
      user.starred.push(boardid);
      message = "Board added to starred list";
    }
    await user.save();
    res.json({
      message,
      starred: user.starred,
    });
  } catch (error) {
    return next(error);
  }
  next();
});

app.use((err, req, res, next) => {
  res.status(500);
  console.trace(err);
  res.json({ error: getErrorMessage(err) });
});

app.listen(port, () =>
  console.log(`[authentication] listening on port ${port}`)
);
