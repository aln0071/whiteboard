import { HIDE_LOADER, SHOW_LOADER } from "./types";

export const showLoaderAction = () => ({
  type: SHOW_LOADER,
});

export const hideLoaderAction = () => ({
  type: HIDE_LOADER,
});
