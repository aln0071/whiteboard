import { SET_BOARDS_LIST } from "../actions/types";

const initialState = {
  ownBoards: [],
  editorBoards: [],
  viewerBoards: [],
};

export default function boards(state = initialState, action) {
  const { type } = action;

  switch (type) {
    case SET_BOARDS_LIST:
      const { list = initialState } = action;
      return {
        ownBoards: [...list.ownBoards],
        editorBoards: [...list.editorBoards],
        viewerBoards: [...list.viewerBoards],
      };
    default:
      return state;
  }
}
