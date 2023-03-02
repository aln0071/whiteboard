const TARGET_SERVICES = {
  board: "http://board:3000",
  whiteboard: "http://whiteboard:80",
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
  {
    url: "/api/v1/board/list",
    auth: true,
    roles: ["user"],
    proxy: {
      target: TARGET_SERVICES.board,
      changeOrigin: true,
    },
  },
  {
    url: "/api/v1/board/logs/:id",
    auth: true,
    roles: ["user"],
    proxy: {
      target: TARGET_SERVICES.board,
      changeOrigin: true,
    },
  },
  {
    url: "/api/v1/board/sharing/:id",
    auth: true,
    roles: ["user"],
    proxy: {
      target: TARGET_SERVICES.board,
      changeOrigin: true,
    },
  },
  {
    url: "/wbo/*",
    auth: true,
    roles: ["user"],
    proxy: {
      target: TARGET_SERVICES.whiteboard,
      changeOrigin: true,
      pathRewrite: { "^/wbo": "" },
    },
  },
];

module.exports = ROUTES;
