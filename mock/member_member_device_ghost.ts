import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 設備關聯（幽靈設備）Mock

const areas = ["台北市", "新北市", "高雄市", "台中市", "桃園市"];
const agents = ["AG1001", "AG1002", "AG1003", "AG2001"];

// 產生單一會員假資料
function makeMember(seed: number) {
  const memberID = 200000 + seed;
  return {
    id: memberID,
    memberID,
    account: `ghost_user${seed}`,
    realName: `測試會員${seed}`,
    agent: agents[seed % agents.length],
    agencyParent: agents[(seed + 1) % agents.length],
    registerIp: `192.168.${seed % 255}.${(seed * 3) % 255}`,
    registerArea: areas[seed % areas.length],
    loginIp: `10.0.${seed % 255}.${(seed * 7) % 255}`,
    lastLoginArea: areas[(seed + 2) % areas.length],
    registerDate: `2026-04-${String((seed % 28) + 1).padStart(2, "0")} 09:15:00`,
    loginDate: `2026-05-${String((seed % 28) + 1).padStart(2, "0")} 21:30:00`,
    tags:
      seed % 3 === 0
        ? [
            {
              id: seed * 10 + 1,
              name: "多帳號",
              tagGroupID: 1,
              updatedAt: "2026-05-20 10:00:00"
            }
          ]
        : [],
    depositLimit: seed % 2 === 0 ? 1 : 2,
    withdrawLimit: seed % 2 === 0 ? 1 : 2,
    status: seed % 3 === 0 ? 2 : 1,
    gameLogin: 1
  };
}

// 產生設備分組（每組 2~4 名會員）
function makeDeviceList() {
  const devices = Array.from({ length: 6 }).map((_, d) => {
    const memberCount = 2 + (d % 3);
    const list = Array.from({ length: memberCount }).map((_, i) =>
      makeMember(d * 10 + i + 1)
    );
    return {
      deviceID: `DEV-GHOST-${1000 + d}`,
      lastLoginAccount: list[0].account,
      deviceIdLastLoginAt: `2026-05-${String((d % 28) + 1).padStart(2, "0")} 22:00:00`,
      list
    };
  });
  return devices;
}

// 最近可疑設備（重複設備）
function makeRepeatList(intervalDay: number) {
  const count = intervalDay >= 30 ? 18 : 10;
  return Array.from({ length: count }).map((_, i) => ({
    deviceID: `DEV-REPEAT-${2000 + i}`,
    totalMemberCount: 3 + (i % 8),
    lockMemberCount: i % 4,
    multiAccountTag: i % 3,
    relateAgent: 1 + (i % 5),
    full: i % 5 === 0
  }));
}

export default defineFakeRoute([
  {
    // 設備關聯查詢
    url: "/backend/risk/search",
    method: "get",
    response: () => {
      const list = makeDeviceList();
      return { success: true, data: { list, total: list.length } };
    }
  },
  {
    // 最近可疑設備
    url: "/backend/risk/repeat/list",
    method: "get",
    response: ({ query }) => {
      const intervalDay = Number(query?.intervalDay ?? 3);
      const list = makeRepeatList(intervalDay);
      return { success: true, data: { list, total: list.length } };
    }
  },
  {
    // 標記全部為多帳號
    url: "/backend/risk/multiaccount",
    method: "put",
    response: () => ({ success: true, data: { list: [] } })
  },
  {
    // 存款功能開關
    url: "/backend/member/deposit",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  {
    // 提款功能開關
    url: "/backend/member/withdraw",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  {
    // 登入功能開關
    url: "/backend/member/status",
    method: "put",
    response: () => ({ success: true, data: null })
  }
]);
