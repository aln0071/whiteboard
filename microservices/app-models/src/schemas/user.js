const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: { type: String, default: "" },
  lastName: { type: String, default: "" },
  image: { type: String, default: "https://www.computerhope.com/jargon/g/guest-user.png" },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  roles: {
    type: [{ type: String }],
    default: ["user"],
  },
  starred: [{ type: Schema.Types.ObjectId, ref: "Board" }],
});

module.exports = UserSchema;
