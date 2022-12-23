export const URLS = {
    LOGIN: '/api/v1/authentication/login',
    REGISTER: '/api/v1/authentication/register'
}

export const getErrorMessage = error => error.response?.data?.error || error.message;