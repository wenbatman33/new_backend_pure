import { getAppEnvConfig } from "@/utils/env";

// 全域設定 hook（移植自舊專案 hooks/setting，移除 warn/型別依賴）
export const useGlobSetting = () => {
  const {
    VITE_GLOB_APP_TITLE,
    VITE_GLOB_API_URL,
    VITE_GLOB_IMG_URL,
    VITE_GLOB_APP_SHORT_NAME,
    VITE_GLOB_API_URL_PREFIX,
    VITE_GLOB_UPLOAD_URL
  } = getAppEnvConfig();

  return {
    title: VITE_GLOB_APP_TITLE,
    apiUrl: VITE_GLOB_API_URL,
    imgUrl: VITE_GLOB_IMG_URL,
    shortName: VITE_GLOB_APP_SHORT_NAME,
    urlPrefix: VITE_GLOB_API_URL_PREFIX,
    uploadUrl: VITE_GLOB_UPLOAD_URL
  };
};
