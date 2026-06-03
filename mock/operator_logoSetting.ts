import { defineFakeRoute } from "vite-plugin-fake-server/client";

// LOGO 設定（單物件設定頁）
const logo = {
  logoWithTextHorizontal: "https://dummyimage.com/300x50/409eff/fff&text=Logo+Brand",
  logoWithPureBlack: "https://dummyimage.com/300x50/000000/fff&text=Logo+Nav",
  logoWithLoadingText: "https://dummyimage.com/300x50/67c23a/fff&text=Logo+Loading",
  logoWithBackground: "https://dummyimage.com/300x50/e6a23c/fff&text=Logo+BG",
  logoWithTextVertical: "https://dummyimage.com/300x50/f56c6c/fff&text=Logo+Vertical"
};

export default defineFakeRoute([
  // 取得 LOGO
  {
    url: "/backend/config/logo",
    method: "get",
    response: () => ({ success: true, data: { ...logo } })
  },
  // 暫存 LOGO
  {
    url: "/backend/config/logo",
    method: "put",
    response: ({ body }) => {
      Object.assign(logo, body || {});
      return { success: true, data: null };
    }
  },
  // 發佈 LOGO
  {
    url: "/backend/config/deploylogo",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  // 上傳檔案
  {
    url: "/file/file/upload",
    method: "post",
    response: () => ({
      success: true,
      data: { url: "/upload/logo/mock_logo.png" }
    })
  }
]);
