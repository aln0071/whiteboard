import { SET_STARRED_BOARDS } from "../actions/types";

const initialState = [];

export default function starredBoards(state = initialState, action) {
  const { type, starredBoards } = action;
  switch (type) {
    case SET_STARRED_BOARDS:
      if (!Array.isArray(starredBoards)) {
        console.error(
          "SET_STARRED_BOARDS action dispatched with non-array boards list: ",
          starredBoards
        );
        return state;
      }
      return [...starredBoards];
    default:
      return state;
  }
}
