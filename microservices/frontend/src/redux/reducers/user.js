import { SET_USER_DETAILS, SET_USER_IMAGE } from "../actions/types";

const initialState = {
  _id: "",
  image: "",
  searchCriteria: "",
  searchResults: []
};

export default function user(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_USER_DETAILS:
      return {
        ...state,
        ...payload,
      };
    case SET_USER_IMAGE:
      return {
        ...state,
        image: payload,
      };
    default:
      return state;
  }
}
