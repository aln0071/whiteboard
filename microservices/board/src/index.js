const express = require("express");
const app = express();
const axios = require("axios");
const port = process.env.PORT || 3000;

const { DB_URI } = require("./config");

const mongoose = require("mongoose");
mongoose.connect(DB_URI);

const { BoardSchema, UserSchema, QuestionSchema } = require("app-models");
const BoardModel = mongoose.model("Board", BoardSchema);
const UserModel = mongoose.model("User", UserSchema);
const QuestionModel = mongoose.model("Question", QuestionSchema);

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

app.post("/api/v1/board/question", async (req, res, next) => {
  const question = req.body;
  try {
    const newQuestion = new QuestionModel();
    newQuestion.question = question.description;
    newQuestion.answerArray = [];
    const result = await newQuestion.save();
    const id = result._id;
    const findboardCondition = {
      name: question.boardName,
    };
    const ansupdateCondition = {
      $addToSet: {
        questions: [id],
      },
    };
    let board = await BoardModel.updateOne(
      findboardCondition,
      ansupdateCondition
    );
    res.send(id);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

app.post("/api/v1/board/answer", async (req, res, next) => {
  const answer = req.body;
  try {
    const newAnswer = {};
    newAnswer.answer = answer.description;
    newAnswer.userId = answer.userId;
    const findboardCondition = {
      _id: answer.questionId,
    };
    const ansupdateCondition = {
      $addToSet: {
        answerArray: [newAnswer],
      },
    };
    await QuestionModel.updateOne(findboardCondition, ansupdateCondition);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

app.post("/api/v1/board/fetchquestions", async (req, res, next) => {
  const answer = req.body;
  try {
    const findboardCondition = {
      name: answer.questionId,
    };
    const question = await BoardModel.find(findboardCondition).populate(
      "questions"
    );
    console.log("fetching check", question);
    res.send(question);
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
    const ownBoardsList = await BoardModel.find(
      { owner: userid, markedForDeletionAt: undefined },
      ["name", "owner"]
    );
    const editorBoardsList = await BoardModel.find(
      { editors: userid, markedForDeletionAt: undefined },
      ["name", "owner"]
    );
    const viewerBoardsList = await BoardModel.find(
      { viewers: userid, markedForDeletionAt: undefined },
      ["name", "owner"]
    );
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

app.get("/api/v1/board/recent", async (req, res, next) => {
  try {
    const userid = req.get("userid");
    const userObjId = new mongoose.Types.ObjectId(userid);
    const boards = await BoardModel.aggregate([
      {
        $match: {
          $and: [
            { "useractivity.userid": userObjId },
            {
              $or: [
                { owner: userObjId, markedForDeletionAt: undefined },
                { editors: userObjId, markedForDeletionAt: undefined },
                { viewers: userObjId, markedForDeletionAt: undefined },
              ],
            },
          ],
        },
      },
      {
        $project: {
          name: 1,
          owner: 1,
          useractivity: {
            $filter: {
              input: "$useractivity",
              cond: { $eq: ["$$this.userid", userObjId] },
            },
          },
        },
      },
      {
        $unwind: "$useractivity",
      },
      {
        $sort: {
          "useractivity.timestamp": -1,
        },
      },
      // {
      //   $group: {
      //     _id: "$_id",
      //     name: { $first: "$name" },
      //     useractivity: { $push: "$useractivity" },
      //   },
      // },
      // {
      //   $project: {
      //     name: 1,
      //     useractivity: {
      //       $slice: ["$useractivity", 1],
      //     },
      //   },
      // },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          owner: { $first: "$owner" },
        },
      },
    ]);
    res.json(boards);
    next();
  } catch (error) {
    next(error);
  }
});

app.put("/api/v1/board/logs/write", async (req, res, next) => {
  const logs = req.body;
  const boardnames = Object.keys(logs);
  const updates = boardnames.map((boardname) => ({
    updateOne: {
      filter: { name: boardname },
      update: {
        $push: {
          useractivity: {
            $each: logs[boardname],
          },
        },
      },
    },
  }));
  try {
    await BoardModel.bulkWrite(updates);
  } catch (error) {
    return next(error);
  }
  res.sendStatus(200);
  next();
});

app.get("/api/v1/board/logs/:id", async (req, res, next) => {
  const boardid = req.params.id;
  const userid = req.get("userid");
  try {
    const board = await BoardModel.findById(boardid, ["useractivity", "owner"]);
    if (board === null) {
      throw new Error("Invalid board id");
    } else if (String(board.owner).localeCompare(userid) !== 0) {
      throw new Error("Only the owner can view analytics of a board");
    }
    res.json(board);
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
    } else if (String(board.owner).localeCompare(String(userid)) !== 0) {
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

app.put("/api/v1/board/removeEditAccess/:id", async (req, res, next) => {
  const boardid = req.params.id;
  try {
    const board = await BoardModel.findById(boardid);
    if (board === null) {
      return next(new Error("Board with this id does not exist"));
    } else {
      const newSharingOptions = req.body;
      const usernames = Object.keys(newSharingOptions);
      board.viewers = usernames;
      board.editors = [];
      await board.save();
      res.json({});
    }
  } catch (error) {
    next(error);
  }
});

app.put("/api/v1/board/delete/mark/:id", async (req, res, next) => {
  const boardid = req.params.id;
  const userid = req.get("userid");
  try {
    const board = await BoardModel.findById(boardid);
    if (board === null) {
      throw new Error("Board with this id does not exist");
    } else {
      if (board.owner.toString() !== userid) {
        throw new Error("Only owner can remove boards");
      }
      if (board.markedForDeletionAt === undefined) {
        board.markedForDeletionAt = new Date();
        await board.save();
        res.json({
          message: "Board moved to trash",
        });
      } else {
        board.markedForDeletionAt = undefined;
        await board.save();
        res.json({
          message: "Board restored",
        });
      }
      next();
    }
  } catch (error) {
    next(error);
  }
});

app.delete("/api/v1/board/delete/:id", async (req, res, next) => {
  const userid = req.get("userid");
  const boardid = req.params.id;
  try {
    const board = await BoardModel.findById(boardid);
    if (board === null) {
      throw new Error("Board not found");
    } else if (board.owner.toString() !== userid) {
      throw new Error("Only owner can delete board");
    } else {
      await axios.delete("http://www:80/delete/" + board.name, {
        headers: {
          Cookie: req.headers.cookie,
        },
      });
      await board.delete();
      res.json({
        message: "Board deleted",
      });
      next();
    }
  } catch (error) {
    next(error);
  }
});

app.get("/api/v1/board/trash", async (req, res, next) => {
  const userid = req.get("userid");
  try {
    const boards = await BoardModel.find({
      owner: userid,
      markedForDeletionAt: { $exists: true },
    });
    res.json(boards);
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
