import { getErrorMessage, URLS } from "../../utils";
import { toast } from "react-toastify";
import axios from "axios";
import { SET_STARRED_BOARDS } from "./types";

export const toggleStarredBoardAction = (boardid) => async (dispatch) => {
  try {
    const response = await axios.post(
      URLS.TOGGLE_STARRED.replace(":id", boardid)
    );
    if (response.status === 200) {
      toast.success(response.data.message);
      dispatch(setStarredBoardsAction(response.data.starred));
    } else {
      throw new Error("Invalid response status " + response.status);
    }
  } catch (error) {
    toast.error(getErrorMessage(error));
  }
};

export const setStarredBoardsAction = (starredBoards) => ({
  type: SET_STARRED_BOARDS,
  starredBoards,
});
