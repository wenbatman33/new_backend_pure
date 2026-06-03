import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 遊戲類型（key/value）
const gameTypes = [
  { key: 2, value: "电子" },
  { key: 3, value: "捕鱼" },
  { key: 4, value: "棋牌" },
  { key: 5, value: "真人" },
  { key: 6, value: "彩票" },
  { key: 7, value: "体育" }
];

// 遊戲廠商（displayName/name/key）
const gameGroups = Array.from({ length: 6 }).map((_, i) => ({
  displayName: `厂商${i + 1}`,
  name: `group${i + 1}`,
  key: i + 1
}));

const statusList = [1, 2, 3, 4];

// 遊戲列表假資料 15 筆
const all = Array.from({ length: 15 }).map((_, i) => {
  const group = gameGroups[i % gameGroups.length];
  const type = gameTypes[i % gameTypes.length];
  return {
    id: i + 1,
    sort: (i + 1) * 10,
    gameGroupID: group.key,
    gameGroupDisplayName: group.displayName,
    name: `game_${i + 1}`,
    displayName: `游戏${i + 1}`,
    gameTypeID: type.key,
    gameTypeName: type.value,
    status: statusList[i % statusList.length],
    trialPlay: (i % 2) + 1,
    isSpecial: (i % 2) + 1,
    isSlot: (i % 2) + 1,
    isNewGame: (i % 2) + 1,
    isHotGame: (i % 2) + 1,
    isReturn: (i % 2) + 1,
    bettingCode: `BET${1000 + i}`,
    gameCodePc: `PC${1000 + i}`,
    gameCodeH5: `H5${1000 + i}`
  };
});

export default defineFakeRoute([
  // 遊戲列表
  {
    url: "/backend/game/gamelist/luckmoney/list",
    method: "get",
    response: ({ query }) => {
      let list = all;
      if (query.name) {
        list = list.filter(v => v.name.includes(query.name));
      }
      if (query.displayName) {
        list = list.filter(v => v.displayName.includes(query.displayName));
      }
      if (query.gameGroupID) {
        list = list.filter(v => v.gameGroupID === Number(query.gameGroupID));
      }
      if (query.status && Number(query.status) !== 0) {
        list = list.filter(v => v.status === Number(query.status));
      }
      return { success: true, data: { list, total: list.length } };
    }
  },
  // 遊戲類型下拉
  {
    url: "/backend/game/gamelist/luckmoney/type",
    method: "get",
    response: () => ({ success: true, data: { list: gameTypes } })
  },
  // 遊戲廠商下拉
  {
    url: "/backend/game/luckmoney/gamegroup/all",
    method: "get",
    response: () => ({ success: true, data: { list: gameGroups } })
  },
  // 取得單筆遊戲（編輯載入）
  {
    url: "/backend/game/gamelist/luckmoney",
    method: "get",
    response: ({ query }) => {
      const item = all.find(v => v.id === Number(query.id)) ?? all[0];
      return { success: true, data: item };
    }
  },
  // 新增遊戲
  {
    url: "/backend/game/gamelist/luckmoney",
    method: "post",
    response: () => ({ success: true, data: { id: 999 } })
  },
  // 修改遊戲
  {
    url: "/backend/game/gamelist/luckmoney",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  // 批次修改遊戲狀態
  {
    url: "/backend/game/gamelist/luckmoney/batchUpdate",
    method: "put",
    response: () => ({ success: true, data: null })
  }
]);
