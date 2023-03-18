const getErrorMessage = (error) => error.response?.data?.error || error.message;

module.exports = {
  getErrorMessage,
};
