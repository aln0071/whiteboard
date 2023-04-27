import { combineReducers } from "redux";
import starredBoards from "./starredBoards";
import user from "./user";
import loader from "./loader";
import boards from "./boards";

export default combineReducers({
  starredBoards,
  user,
  loader,
  boards,
});
