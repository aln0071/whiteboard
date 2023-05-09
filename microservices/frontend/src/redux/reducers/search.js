import { SET_SEARCH_RESULTS } from "../actions/types";

const initialState = {
    searchResults: []
};

export default function search(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case SET_SEARCH_RESULTS:
            return {
                ...state,
                searchResults: [...payload],
            };
        default:
            return state;
    }
}
