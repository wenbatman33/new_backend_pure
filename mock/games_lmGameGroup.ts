import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 幸運金遊戲廠商假資料
const gameTypes = [
  { id: 1, name: "电子" },
  { id: 2, name: "捕鱼" },
  { id: 3, name: "棋牌" },
  { id: 4, name: "真人" }
];

const groupList = Array.from({ length: 16 }).map((_, i) => ({
  id: i + 1,
  name: `LM_GROUP_${i + 1}`,
  displayName: `幸运金厂商${i + 1}`,
  sort: (i + 1) * 10,
  gameAgencyID: (i % 3) + 1,
  gameAgencyName: `代理商${(i % 3) + 1}`,
  walletType: (i % 2) + 1,
  gameType: gameTypes[i % gameTypes.length],
  openWayPc: (i % 3) + 1,
  openWayH5: (i % 3) + 1,
  platformFeeRatio: `${(i % 5) + 1}%`,
  status: (i % 4) + 1,
  maintainTime: i % 4 === 2 ? "2026-06-30 12:00:00" : "",
  gameListID: "",
  gameListIDTurnover: i + 1
}));

export default defineFakeRoute([
  {
    // 取得幸運金遊戲廠商列表
    url: "/backend/game/luckmoney/gamegroup/list",
    method: "get",
    response: ({ query }) => {
      let list = groupList;
      if (query.name) {
        list = list.filter(v => v.name.includes(query.name));
      }
      if (query.displayName) {
        list = list.filter(v => v.displayName.includes(query.displayName));
      }
      if (query.gameAgencyID) {
        list = list.filter(v => v.gameAgencyID === Number(query.gameAgencyID));
      }
      if (query.walletType) {
        list = list.filter(v => v.walletType === Number(query.walletType));
      }
      if (query.gameTypeID) {
        list = list.filter(v => v.gameType.id === Number(query.gameTypeID));
      }
      if (query.status) {
        list = list.filter(v => v.status === Number(query.status));
      }
      return { success: true, data: { list, total: list.length } };
    }
  },
  {
    // 修改幸運金遊戲廠商
    url: "/backend/game/luckmoney/gamegroup",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  {
    // 取得幸運金遊戲代理商選單
    url: "/backend/game/luckmoney/gameagency/all",
    method: "get",
    response: () => ({
      success: true,
      data: {
        list: [
          { key: 1, value: "代理商1" },
          { key: 2, value: "代理商2" },
          { key: 3, value: "代理商3" }
        ]
      }
    })
  },
  {
    // 取得遊戲類型
    url: "/backend/game/gamelist/type",
    method: "get",
    response: () => ({
      success: true,
      data: { list: gameTypes.map(t => ({ key: t.id, value: t.name })) }
    })
  },
  {
    // 取得遊戲列表（編輯彈窗流水下拉用）
    url: "/backend/game/gamelist/list",
    method: "get",
    response: () => ({
      success: true,
      data: {
        list: Array.from({ length: 8 }).map((_, i) => ({
          id: i + 1,
          name: `游戏${i + 1}`
        })),
        total: 8
      }
    })
  },
  {
    // 取得幸運金操作紀錄
    url: "/backend/game/luckmoney/log",
    method: "get",
    response: () => ({
      success: true,
      data: {
        list: Array.from({ length: 6 }).map((_, i) => ({
          updatedAt: `2026-06-0${i + 1} 09:1${i}:00`,
          updatedUser: i % 2 === 0 ? "admin" : "operator01",
          action: "编辑厂商",
          content: `修改字段 status：${i % 4} → ${(i % 4) + 1}`
        }))
      }
    })
  }
]);
