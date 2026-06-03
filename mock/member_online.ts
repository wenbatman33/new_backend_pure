import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 在線會員假資料
const areas = ["台灣", "中國", "香港", "馬來西亞", "越南", "泰國"];
const devices = ["iPhone 15 / iOS", "Android / Chrome", "Windows / Edge", "Mac / Safari"];
const all = Array.from({ length: 16 }).map((_, i) => ({
  ID: 100001 + i,
  account: `member${String(i + 1).padStart(3, "0")}`,
  name: `會員${i + 1}`,
  loginArea: areas[i % areas.length],
  loginIP: `192.168.${(i % 5) + 1}.${(i * 7) % 255}`,
  loginDevice: devices[i % devices.length],
  loginAt: `2026-06-0${(i % 3) + 1} ${String((i % 24)).padStart(2, "0")}:${String((i % 60)).padStart(2, "0")}:00`
}));

export default defineFakeRoute([
  {
    url: "/backend/member/online",
    method: "get",
    response: ({ query }) => {
      let list = all;
      const isExact = Number(query.isFuzzy) === 2; // 2 完全相符 / 1 模糊
      if (query.id) {
        list = list.filter(v =>
          isExact ? String(v.ID) === String(query.id) : String(v.ID).includes(query.id)
        );
      }
      if (query.account) {
        list = list.filter(v =>
          isExact ? v.account === query.account : v.account.includes(query.account)
        );
      }
      if (query.name) {
        list = list.filter(v => v.name.includes(query.name));
      }
      if (query.loginIP) {
        list = list.filter(v => v.loginIP.includes(query.loginIP));
      }
      if (query.loginDevice) {
        list = list.filter(v => v.loginDevice.includes(query.loginDevice));
      }
      return { success: true, data: { list, total: list.length } };
    }
  }
]);
