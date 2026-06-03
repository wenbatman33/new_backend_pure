import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 網站基本設定假資料
let profile = {
  nuxtPublicName: "幸運娛樂城",
  nuxtPublicTitle: "幸運娛樂城 - 線上博弈第一品牌",
  nuxtPublicDescription:
    "提供最安全、最公平的線上博弈體驗，24 小時專業客服為您服務。",
  nuxtPublicKeywords: "娛樂城,線上博弈,真人百家樂,體育投注,電子遊戲,老虎機"
};

export default defineFakeRoute([
  {
    url: "/backend/config/webprofile",
    method: "get",
    response: () => ({ success: true, data: profile })
  },
  {
    url: "/backend/config/webprofile",
    method: "put",
    response: ({ body }) => {
      profile = { ...profile, ...(body ?? {}) };
      return { success: true, data: profile };
    }
  },
  {
    url: "/backend/config/deploywebprofile",
    method: "post",
    response: () => ({ success: true, data: null })
  }
]);
