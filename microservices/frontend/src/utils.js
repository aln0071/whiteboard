export const URLS = {
    LOGIN: '/api/v1/authentication/login',
    REGISTER: '/api/v1/authentication/register',
    IS_LOGGED_IN: '/api/v1/authentication/isLoggedIn',
    LOGOUT: '/api/v1/authentication/logout'
}

export const getErrorMessage = error => error.response?.data?.error || error.message;