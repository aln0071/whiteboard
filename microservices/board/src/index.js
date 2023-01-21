const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const { DB_URI } = require("./config");

const mongoose = require("mongoose");
mongoose.connect(DB_URI);

const { BoardSchema } = require("app-models");
const BoardModel = mongoose.model("Board", BoardSchema);

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
    res.json({
      ownBoards: ownBoardsList || [],
    });
    next();
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
