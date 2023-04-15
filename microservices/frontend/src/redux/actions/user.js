import { SET_USER_DETAILS, SET_USER_IMAGE } from "./types";

export const setUserDetailsAction = (payload) => ({
  type: SET_USER_DETAILS,
  payload,
});

export const setUserImageAction = (imageUrl) => ({
  type: SET_USER_IMAGE,
  payload: imageUrl,
});
