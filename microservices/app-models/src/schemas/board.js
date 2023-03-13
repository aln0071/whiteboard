const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BoardSchema = new Schema({
  name: { type: String, required: true, unique: true },
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  viewers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  editors: [{ type: Schema.Types.ObjectId, ref: "User" }],
  questions: [{ type: Schema.Types.ObjectId, ref: "Question", default: [] }],
});

module.exports = BoardSchema;
