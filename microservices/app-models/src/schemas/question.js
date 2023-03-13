const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
  question: { type: String, required: true },
  answerArray: [{
    answer: { type: String },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    default: []
  }]
});

module.exports = QuestionSchema;
