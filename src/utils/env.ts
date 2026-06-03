// 取得 .env 內的全域設定（移植自舊專案 utils/env）
export function getAppEnvConfig() {
  const env = import.meta.env;
  return {
    VITE_GLOB_APP_TITLE: env.VITE_GLOB_APP_TITLE,
    VITE_GLOB_API_URL: env.VITE_GLOB_API_URL,
    VITE_GLOB_IMG_URL: env.VITE_GLOB_IMG_URL,
    VITE_GLOB_APP_SHORT_NAME: env.VITE_GLOB_APP_SHORT_NAME,
    VITE_GLOB_API_URL_PREFIX: env.VITE_GLOB_API_URL_PREFIX,
    VITE_GLOB_UPLOAD_URL: env.VITE_GLOB_UPLOAD_URL
  };
}
