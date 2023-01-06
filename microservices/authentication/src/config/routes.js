const TARGET_SERVICES = {
  board: "http://board:3000",
};

const ROUTES = [
  {
    url: "/api/v1/board",
    auth: false,
    roles: [],
    proxy: {
      target: TARGET_SERVICES.board,
      changeOrigin: true,
    },
  },
  {
    url: "/api/v1/board/create/:boardname",
    auth: true,
    roles: ["user"],
    proxy: {
      target: TARGET_SERVICES.board,
      changeOrigin: true,
    },
  },
];

module.exports = ROUTES;
