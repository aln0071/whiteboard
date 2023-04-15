import { SET_USER_DETAILS, SET_USER_IMAGE } from "../actions/types";

const initialState = {
  _id: "",
  image: "",
};

export default function user(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_USER_DETAILS:
      return {
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
