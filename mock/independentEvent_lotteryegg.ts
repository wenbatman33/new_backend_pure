import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 彩蛋活動列表假資料（status：1 進行中 / 2 已結束）
const eggList = Array.from({ length: 15 }).map((_, i) => ({
  id: i + 1,
  name: `复活节彩蛋活动 ${i + 1}`,
  promotionCode: `EGG${String(i + 1).padStart(3, "0")}`,
  startDate: `2026-05-${String((i % 28) + 1).padStart(2, "0")}`,
  endDate: `2026-06-${String((i % 28) + 1).padStart(2, "0")}`,
  startTime: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 12:00:00`,
  roundTime: (i % 5) + 1,
  status: (i % 3) + 1 > 2 ? 2 : 1,
  updatedAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 18:30:00`,
  updatedUser: i % 2 === 0 ? "admin" : "operator01"
}));

// 單筆彩蛋活动详情
function eggDetail(id: number) {
  return {
    id,
    name: `复活节彩蛋活动 ${id}`,
    promotionCode: `EGG${String(id).padStart(3, "0")}`,
    startDate: "2026-05-01",
    endDate: "2026-06-01",
    startTime: "2026-05-01 12:00:00",
    roundTime: 30,
    roundTotal: 10,
    eventTurnover: 5,
    game: [
      { gameTypeID: 1, gameGroupID: 11 },
      { gameTypeID: 2, gameGroupID: 21 }
    ],
    withdrawLimit: 100000,
    memberMax: 3,
    bonus: [
      { amount: 88, num: 100 },
      { amount: 188, num: 50 }
    ],
    bonusLess: [{ amount: 8, num: 999 }],
    status: 1
  };
}

// 异动纪录假资料
const logList = Array.from({ length: 8 }).map((_, i) => ({
  id: i + 1,
  updatedAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 09:1${i}:00`,
  updatedUser: i % 2 === 0 ? "admin" : "operator01",
  item: i % 2 === 0 ? "新增活动" : "修改场次",
  content: `将励数值由 ${i * 10} 调整为 ${(i + 1) * 10}`
}));

// 游戏厂商 / 游戏群组（cascader 用）
const gameGroupList = Array.from({ length: 4 }).map((_, i) => ({
  id: i + 1,
  name: `游戏厂商 ${i + 1}`,
  gameGroupList: Array.from({ length: 3 }).map((__, j) => ({
    id: (i + 1) * 10 + j + 1,
    name: `游戏群组 ${i + 1}-${j + 1}`,
    displayName: `Group ${i + 1}-${j + 1}`,
    status: [1, 3, 4][j % 3]
  }))
}));

export default defineFakeRoute([
  {
    url: "/backend/event/easter/egg/list",
    method: "get",
    response: ({ query }) => {
      let list = eggList;
      if (query.name) {
        list = list.filter(v => v.name.includes(query.name));
      }
      if (query.roundTime) {
        list = list.filter(v => v.roundTime === Number(query.roundTime));
      }
      return { success: true, data: { list, total: list.length } };
    }
  },
  {
    url: "/backend/event/easter/egg",
    method: "get",
    response: ({ query }) => ({
      success: true,
      data: eggDetail(Number(query.id) || 1)
    })
  },
  {
    url: "/backend/event/easter/egg",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/event/easter/egg",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/event/easter/egg/status",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/event/easter/egg/log",
    method: "get",
    response: () => ({ success: true, data: { list: logList, total: logList.length } })
  },
  // 注意：/backend/game/gamegroup/getgamegroupcategorizedbygametype 屬 game 域，
  // 若 game 域尚未提供 mock，啟用以下節點（gameGroupList 帶 children）；
  // 為避免與 game 域 mock 重複註冊，預設關閉。
  {
    url: "/backend/game/gamegroup/getgamegroupcategorizedbygametype/lotteryegg",
    method: "get",
    response: () => ({ success: true, data: { list: gameGroupList } })
  }
]);
