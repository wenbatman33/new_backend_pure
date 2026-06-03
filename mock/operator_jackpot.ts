import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 假 Jackpot 設定（單一物件）
const settings = {
  min: "10000.00",
  max: "50000.00",
  cycle: "5",
  min_cycle: "1.00",
  max_cycle: "10.00"
};

export default defineFakeRoute([
  {
    // 取得假 Jackpot 設定
    url: "/backend/config/jackpot",
    method: "get",
    response: () => ({ success: true, data: { ...settings } })
  },
  {
    // 更新假 Jackpot 設定
    url: "/backend/config/jackpot",
    method: "put",
    response: ({ body }) => {
      Object.assign(settings, body ?? {});
      return { success: true, data: { ...settings } };
    }
  }
]);
