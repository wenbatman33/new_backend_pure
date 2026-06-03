import { useGlobSetting } from "@/hooks/setting";
const { imgUrl, apiUrl } = useGlobSetting();
const isNewServer = import.meta.env.VITE_GLOB_APP_NEW_SERVER;
export function getImagPath() {
  // 判斷 isNewServer 是否存在，若存在判斷是否為 true，若為 true 則回傳 imgUrl + '/'，否則回傳 apiUrl + '/file/'
  return isNewServer === "true" ? imgUrl + "/" : apiUrl + "/file/";
}

export function apiServerUrl(path) {
  return getImagPath() + path;
}
export function apiServerUrlWithoutFile(path) {
  return imgUrl + "/" + path;
}

// 上傳圖片時顯示apiServerUrl
// 須將編輯器內容的網址修改為 storage 的位置
export function changeContentImagePath(content) {
  return content.replaceAll(apiUrl + "/file", imgUrl);
}
