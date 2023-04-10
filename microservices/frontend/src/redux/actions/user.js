import { SET_USER_DETAILS } from "./types";

export const setUserDetailsAction = (payload) => ({
  type: SET_USER_DETAILS,
  payload,
});
