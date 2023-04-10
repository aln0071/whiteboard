import { combineReducers } from "redux";
import starredBoards from "./starredBoards";
import user from "./user";

export default combineReducers({
  starredBoards,
  user,
});
