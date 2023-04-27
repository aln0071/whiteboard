import { SET_BOARDS_LIST } from "./types";
import { toast } from "react-toastify";
import { URLS, getErrorMessage } from "../../utils";
import axios from "axios";

export const setBoardsListAction = (list) => ({
  type: SET_BOARDS_LIST,
  list,
});

export const getAllBoardsListAction = () => async (dispatch) => {
  try {
    const response = await axios.get(URLS.GET_BOARDS_LIST);
    if (response.status === 200) {
      dispatch(setBoardsListAction(response.data));
    } else {
      throw new Error("Invalid response status: " + response.status);
    }
  } catch (error) {
    toast.error(getErrorMessage(error));
  }
};
