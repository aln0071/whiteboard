import { SET_SEARCH_RESULTS } from "./types";
import { toast } from "react-toastify";
import { URLS, getErrorMessage } from "../../utils";
import axios from "axios";

export const setSearchResults = (searchKey) => async (dispatch) => {
    try {
        const response = await axios.post(URLS.SEARCH_KEY, { searchKey: searchKey });
        if (response.status === 200) {
            dispatch({
                type: SET_SEARCH_RESULTS,
                payload: response.data,
            });
        } else {
            throw new Error("Invalid response status: " + response.status);
        }
    } catch (error) {
        toast.error(getErrorMessage(error));
    }
};