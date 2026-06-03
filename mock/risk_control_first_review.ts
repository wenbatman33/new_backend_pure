import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 風控-初審名單 假資料
const tagPool = [
  { id: 1, name: "高風險", tagGroupID: 1, updatedAt: "2026-05-10 09:00:00" },
  { id: 2, name: "套利", tagGroupID: 2, updatedAt: "2026-05-12 11:20:00" },
  { id: 3, name: "多帳號", tagGroupID: 1, updatedAt: "2026-05-15 14:30:00" }
];

const checkList = Array.from({ length: 16 }).map((_, i) => ({
  memberID: 200000 + i,
  account: `member${i + 1}`,
  name: `测试用户${i + 1}`,
  agent: i % 3 === 0 ? "0" : `agent${(i % 4) + 1}`,
  phone: `09${String(10000000 + i).slice(0, 8)}`,
  registerIp: `192.168.1.${i + 1}`,
  ipLocation: "中国-广东",
  registerDevice: `device-${1000 + i}`,
  phoneLocation: "中国",
  bankCardLocation: "中国",
  registerDate: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 10:30:00`,
  deviceId: `device-${1000 + i}`,
  tags: i % 2 === 0 ? [tagPool[i % tagPool.length]] : []
}));

const ipDeviceList = Array.from({ length: 12 }).map((_, i) => ({
  memberID: 300000 + i,
  account: `relate${i + 1}`,
  agent: i % 2 === 0 ? "0" : `agent${(i % 3) + 1}`,
  registerDate: `2026-04-${String((i % 28) + 1).padStart(2, "0")} 08:15:00`,
  loginDate: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 20:45:00`,
  registerIp: `192.168.1.${i + 1}`,
  registerDevice: `device-${1000 + i}`,
  loginIp: `10.0.0.${i + 1}`,
  loginDevice: `device-${2000 + i}`
}));

export default defineFakeRoute([
  {
    url: "/backend/risk/member/list",
    method: "get",
    response: ({ query }) => {
      let list = checkList;
      if (query.memberID) {
        list = list.filter(v => String(v.memberID).includes(query.memberID));
      }
      if (query.account) {
        list = list.filter(v => v.account.includes(query.account));
      }
      if (query.agent) {
        list = list.filter(v => v.agent.includes(query.agent));
      }
      return { success: true, data: { list, total: list.length } };
    }
  },
  {
    url: "/backend/risk/member/check",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/risk/ip/list",
    method: "get",
    response: () => ({
      success: true,
      data: { list: ipDeviceList, total: ipDeviceList.length }
    })
  },
  {
    url: "/backend/risk/device/list",
    method: "get",
    response: () => ({
      success: true,
      data: { list: ipDeviceList, total: ipDeviceList.length }
    })
  }
]);
