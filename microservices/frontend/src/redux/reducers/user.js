import { SET_USER_DETAILS } from "../actions/types";

const initialState = {
  userid: "",
};

export default function user(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_USER_DETAILS:
      return {
        ...payload,
      };
    default:
      return state;
  }
}
