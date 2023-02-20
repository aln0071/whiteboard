export const URLS = {
  LOGIN: "/api/v1/authentication/login",
  REGISTER: "/api/v1/authentication/register",
  IS_LOGGED_IN: "/api/v1/authentication/isLoggedIn",
  LOGOUT: "/api/v1/authentication/logout",
  CREATE_BOARD: "/api/v1/board/create",
  GET_BOARDS_LIST: "/api/v1/board/list",
  EDIT_BOARD_SHARING_OPTIONS: "/api/v1/board/sharing/:id",
};

export const getErrorMessage = (error) =>
  error.response?.data?.error || error.message;
