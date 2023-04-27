const TARGET_SERVICES = {
  board: "http://board:3000",
  whiteboard: "http://whiteboard:80",
  chatgpt: "http://chatgpt:3000",
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
    url: "/api/v1/board/recent",
    auth: true,
    roles: ["user"],
    proxy: {
      target: TARGET_SERVICES.board,
      changeOrigin: true,
    },
  },
  {
    url: "/api/v1/board/delete/mark/:id",
    auth: true,
    roles: ["user"],
    proxy: {
      target: TARGET_SERVICES.board,
      changeOrigin: true,
    },
  },
  {
    url: "/api/v1/board/delete/:id",
    auth: true,
    roles: ["user"],
    proxy: {
      target: TARGET_SERVICES.board,
      changeOrigin: true,
    },
  },
  {
    url: "/api/v1/board/trash",
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
  {
    url: "/api/v1/chatgpt",
    auth: false,
    roles: [],
    proxy: {
      target: TARGET_SERVICES.chatgpt,
      changeOrigin: true,
    },
  },
  {
    url: "/api/v1/chatgpt/prompt",
    auth: true,
    roles: ["user"],
    proxy: {
      target: TARGET_SERVICES.chatgpt,
      changeOrigin: true,
    },
  },
];

module.exports = ROUTES;
