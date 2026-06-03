import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 登入型別：1 註冊 / 2 登入；success：1 成功 / 0 失敗
const areas = ["台灣", "香港", "新加坡", "馬來西亞"];
const deviceTypes = ["iOS", "Android", "Web"];
const all = Array.from({ length: 18 }).map((_, i) => ({
  id: i + 1,
  memberID: 100000 + i,
  account: `member${i + 1}`,
  name: `會員${i + 1}`,
  registeredAt: `2026-04-${String((i % 28) + 1).padStart(2, "0")} 09:15:00`,
  loginType: (i % 2) + 1,
  loginArea: areas[i % areas.length],
  loginIP: `192.168.${i % 255}.${(i * 7) % 255}`,
  loginDeviceID: `DEV-${(1000 + i).toString(16).toUpperCase()}`,
  loginDeviceType: deviceTypes[i % deviceTypes.length],
  appVersion: `1.${i % 5}.0`,
  loginUserAgent: "Mozilla/5.0 (compatible; LuckBot/1.0)",
  createdAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 14:30:00`,
  success: i % 4 === 0 ? 0 : 1,
  failReason: i % 4 === 0 ? (i % 6) + 2 : 0
}));

export default defineFakeRoute([
  {
    url: "/backend/member/login/log/search",
    method: "get",
    response: ({ query }) => {
      let list = all;
      if (query.account) {
        list = list.filter(v => v.account.includes(query.account));
      }
      if (query.loginIP) {
        list = list.filter(v => v.loginIP.includes(query.loginIP));
      }
      if (query.loginDeviceID) {
        list = list.filter(v => v.loginDeviceID.includes(query.loginDeviceID));
      }
      if (query.loginType) {
        list = list.filter(v => v.loginType === Number(query.loginType));
      }
      return { success: true, data: { list, total: list.length } };
    }
  }
]);
