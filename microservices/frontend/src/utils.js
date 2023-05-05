export const URLS = {
  LOGIN: "/api/v1/authentication/login",
  REGISTER: "/api/v1/authentication/register",
  IS_LOGGED_IN: "/api/v1/authentication/isLoggedIn",
  LOGOUT: "/api/v1/authentication/logout",
  CREATE_BOARD: "/api/v1/board/create",
  GET_PROFILE_DETAILS: "/api/v1/authentication/getProfile",
  UPDATE_PROFILE_DETAILS: "/api/v1/authentication/updateProfile",
  GET_BOARDS_LIST: "/api/v1/board/list",
  EDIT_BOARD_SHARING_OPTIONS: "/api/v1/board/sharing/:id",
  BOARD_SHARING_OPTIONS: "/api/v1/board/sharinglist/:boardName",
  REMOVE_ALL_EDIT_ACCESS: "/api/v1/board/removeEditAccess/:id",
  GET_BOARD_ANALYTICS: "/api/v1/board/logs/:id",
  CHAT_GPT_ASK_QUESTION: "/api/v1/chatgpt/prompt",
  FETCH_QUESTIONS: "/api/v1/board/fetchquestions",
  TOGGLE_STARRED: "/api/v1/authentication/toggleStarred/:id",
  GET_RECENT_BOARDS: "/api/v1/board/recent",
  GET_TRASH_BOARDS: "/api/v1/board/trash",
  TOGGLE_TRASH: "/api/v1/board/delete/mark/:id",
  DELETE_FOREVER: "/api/v1/board/delete/:id",
  AUTOCOMPLETE: "/api/v1/authentication/autocomplete/:name",
};

export const getErrorMessage = (error) =>
  error.response?.data?.error || error.message;
