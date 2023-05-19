import { SET_USER_DETAILS, SET_USER_IMAGE, SET_SEARCH_RESULTS } from "./types";
import { toast } from "react-toastify";
import { URLS, getErrorMessage } from "../../utils";
import axios from "axios";

export const setUserDetailsAction = (payload) => ({
  type: SET_USER_DETAILS,
  payload,
});

export const setUserImageAction = (imageUrl) => ({
  type: SET_USER_IMAGE,
  payload: imageUrl,
});