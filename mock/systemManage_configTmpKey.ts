import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 前台動態設定（layout）假資料
const dynamicConfigs = {
  theme: "dark",
  maintenance: false,
  banner: {
    enabled: true,
    title: "Welcome",
    imageUrl: "https://cdn.example.com/banner.png"
  },
  features: {
    sportsbook: true,
    liveCasino: true,
    lottery: false
  },
  hotGames: [101, 102, 205, 308],
  announcement: "系统于每周三凌晨维护",
  currencyList: ["CNY", "USD", "EUR"],
  contactInfo: {
    email: "support@example.com",
    telegram: "@support",
    workTime: "09:00 - 21:00"
  }
};

export default defineFakeRoute([
  {
    // 取得前台动态设定
    url: "/backend/config/layout",
    method: "get",
    response: () => {
      return { success: true, data: { dynamicConfigs } };
    }
  },
  {
    // 更新前台动态设定
    url: "/backend/config/layout",
    method: "put",
    response: () => {
      return { success: true, data: null };
    }
  },
  {
    // 发布前台动态设定
    url: "/backend/config/deploylayout",
    method: "post",
    response: () => {
      return { success: true, data: null };
    }
  }
]);
