const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  roles: {
    type: [{ type: String }],
    default: ["user"],
  },
});

module.exports = UserSchema;
