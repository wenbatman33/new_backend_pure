import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 裝置黑名單假資料
const reasons = ["多帳號關聯", "異常登入", "套利風控標記", "黑產裝置", "盜號裝置"];
const accounts = ["admin", "operator01", "risk_admin", "SYSTEM"];
const all = Array.from({ length: 18 }).map((_, i) => ({
  id: i + 1,
  deviceID: `DEVICE-${String(100000 + i * 37).padStart(8, "0")}`,
  reason: reasons[i % reasons.length],
  createdAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 10:${String(
    (i * 7) % 60
  ).padStart(2, "0")}:00`,
  createUserAccount: accounts[i % accounts.length]
}));

export default defineFakeRoute([
  // 列表查詢
  {
    url: "/backend/member/deviceid/blacklist",
    method: "get",
    response: ({ query }) => {
      let list = all;
      if (query.deviceID) {
        // 精準查詢
        list = list.filter(v => v.deviceID === query.deviceID);
      } else if (query.deviceIDPart) {
        // 模糊查詢
        list = list.filter(v => v.deviceID.includes(query.deviceIDPart));
      }
      return { success: true, data: { list, total: list.length } };
    }
  },
  // 新增
  {
    url: "/backend/member/deviceid/blacklist",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  // 刪除
  {
    url: "/backend/member/deviceid/blacklist",
    method: "delete",
    response: () => ({ success: true, data: null })
  },
  // 編輯原因
  {
    url: "/backend/member/deviceid/reason",
    method: "put",
    response: () => ({ success: true, data: null })
  }
]);
