const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const { DB_URI } = require("./config");

const mongoose = require("mongoose");
mongoose.connect(DB_URI);

const { BoardSchema, UserSchema } = require("app-models");
const BoardModel = mongoose.model("Board", BoardSchema);
const UserModel = mongoose.model("User", UserSchema);

app.use(express.json());

app.get("/api/v1/board", (req, res) => {
  res.json({
    msg: "board",
  });
});

app.post("/api/v1/board/create/:boardname", async (req, res, next) => {
  const boardname = req.params.boardname;
  if (/^[\w%\-_~()]*$/.test(boardname) === false) {
    return next(new Error("Invalid board name"));
  }
  try {
    const newBoard = new BoardModel();
    newBoard.name = boardname;
    newBoard.owner = req.get("userid");
    await newBoard.save();
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

app.get("/api/v1/board/getusers/:boardname", async (req, res, next) => {
  const boardname = req.params.boardname;
  if (/^[\w%\-_~()]*$/.test(boardname) === false) {
    return next(new Error("Invalid board name"));
  }
  try {
    const board = await BoardModel.findOne({ name: boardname });
    if (board === null) {
      return next(new Error("Board with this name does not exist"));
    } else {
      res.json({
        owner: board.owner,
        viewers: board.viewers || [],
        editors: board.editors || [],
      });
      next();
    }
  } catch (error) {
    next(error);
  }
});

app.get("/api/v1/board/list", async (req, res, next) => {
  const userid = req.get("userid");
  try {
    const ownBoardsList = await BoardModel.find({ owner: userid }, "name");
    const editorBoardsList = await BoardModel.find({ editors: userid }, "name");
    const viewerBoardsList = await BoardModel.find({ viewers: userid }, "name");
    res.json({
      ownBoards: ownBoardsList || [],
      editorBoards: editorBoardsList || [],
      viewerBoards: viewerBoardsList || [],
    });
    next();
  } catch (error) {
    next(error);
  }
});

app.put("/api/v1/board/sharing/:id", async (req, res, next) => {
  const userid = req.get("userid");
  const boardid = req.params.id;
  try {
    const board = await BoardModel.findById(boardid);
    if (board === null) {
      return next(new Error("Board with this id does not exist"));
    } else if (String(board.owner).localeCompare(String(userid))) {
      return next(
        new Error("Only the owner can change sharing options of the board")
      );
    } else {
      const newSharingOptions = req.body;
      const editors = [];
      const viewers = [];
      const usernames = Object.keys(newSharingOptions);
      const results = await Promise.all(
        usernames.map(
          (username) =>
            new Promise(async (resolve, reject) => {
              try {
                const user = await UserModel.findOne({ username });
                if (user !== null) {
                  if (newSharingOptions[username] === "editor") {
                    editors.push(user._id);
                  } else {
                    viewers.push(user._id);
                  }
                } else {
                  throw new Error("User does not exist");
                }
                resolve("success");
              } catch (error) {
                console.log(error);
                resolve("failure");
              }
            })
        )
      );
      board.viewers = viewers;
      board.editors = editors;
      await board.save();
      res.json({
        editors,
        viewers,
        results,
      });
    }
  } catch (error) {
    next(error);
  }
});

app.use((err, req, res, next) => {
  if (
    err.message.startsWith(
      "E11000 duplicate key error collection: data.boards index: name_1 dup key:"
    )
  ) {
    res.status(400);
    res.json({ error: "Board name in use" });
  } else {
    res.status(500);
    res.json({ error: err.message });
  }
  console.trace(err);
});

app.listen(port, () => console.log(`[board] listening on port ${port}`));
