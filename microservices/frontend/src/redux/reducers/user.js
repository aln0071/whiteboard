import { SET_USER_DETAILS, SET_USER_IMAGE, SET_SEARCH, SET_SEARCH_RESULTS } from "../actions/types";

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
    case SET_SEARCH:
      return {
        ...state,
        searchCriteria: payload,
      };
    case SET_SEARCH_RESULTS:
      return {
        ...state,
        searchResults: [...payload],
      };
    default:
      return state;
  }
}
