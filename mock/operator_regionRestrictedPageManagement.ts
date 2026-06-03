import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 地區限制頁面設定（單一設定物件，非列表）
const config = {
  title: "地区限制提示页",
  logo: "upload/banner/region_logo.png",
  url: "https://cs.example.com",
  buttonContent: "联系客服",
  content:
    "<p>很抱歉，您所在的地区暂时无法访问本平台。</p><p>如有疑问，请点击下方按钮联系在线客服。</p>"
};

export default defineFakeRoute([
  // 讀取設定
  {
    url: "/backend/config/regional_restriction",
    method: "get",
    response: () => ({ success: true, data: config })
  },
  // 儲存設定
  {
    url: "/backend/config/regional_restriction",
    method: "put",
    response: ({ body }) => {
      Object.assign(config, body ?? {});
      return { success: true, data: config };
    }
  },
  // 更新發布
  {
    url: "/backend/config/deploy_regional_restriction",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  // 圖片上傳
  {
    url: "/file/file/upload",
    method: "post",
    response: () => ({
      success: true,
      data: { url: "upload/banner/region_logo.png" }
    })
  }
]);
