import { HIDE_LOADER, SHOW_LOADER } from "../actions/types";

const initialState = false;

export default function loader(state = initialState, action) {
  const { type } = action;
  switch (type) {
    case SHOW_LOADER:
      return true;
    case HIDE_LOADER:
      return false;
    default:
      return state;
  }
}
