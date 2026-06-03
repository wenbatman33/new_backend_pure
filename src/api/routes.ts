type Result = {
  success: boolean;
  data: Array<any>;
};

/**
 * 本專案採「純靜態路由」架構：所有選單/路由都定義在 src/router/modules/*.ts，
 * 不使用後端動態路由。舊 18_BO_ADMIN 後端沒有 /get-async-routes 端點，
 * 故這裡直接回空陣列（handleAsyncRoutes 收到 [] 會以靜態 modules 建選單）。
 */
export const getAsyncRoutes = (): Promise<Result> => {
  return Promise.resolve({ success: true, data: [] });
};
