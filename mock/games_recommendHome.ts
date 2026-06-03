import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 遊戲類型：key=gameTypeID, value=顯示名稱
const gameTypeList = [
  { key: 1, value: "電子" },
  { key: 2, value: "捕魚" },
  { key: 3, value: "棋牌" }
];

// 廠商清單（依 gameTypeID 過濾）
const gameGroups = [
  { id: 11, displayName: "PG 電子", gameTypeID: 1 },
  { id: 12, displayName: "PP 電子", gameTypeID: 1 },
  { id: 13, displayName: "JDB 電子", gameTypeID: 1 },
  { id: 21, displayName: "JILI 捕魚", gameTypeID: 2 },
  { id: 22, displayName: "CQ9 捕魚", gameTypeID: 2 },
  { id: 31, displayName: "開元棋牌", gameTypeID: 3 }
];

// 遊戲清單（依 gameGroupID 過濾）
function gamesOfGroup(gameGroupID: number) {
  return Array.from({ length: 8 }).map((_, i) => ({
    id: gameGroupID * 100 + i + 1,
    displayName: `游戏${gameGroupID}-${i + 1}`,
    gameGroupID
  }));
}

// 首頁推薦表格資料：每組 gameTypeID + isTag 一張表
function buildHomePage() {
  const tables: any[] = [];
  gameTypeList.forEach(t => {
    [1, 2].forEach(isTag => {
      const list = Array.from({ length: 6 }).map((_, i) => {
        const group = gameGroups.find(g => g.gameTypeID === t.key)!;
        return {
          id: `${t.key}-${isTag}-${i + 1}`,
          recommendedSort: i + 1,
          gameTypeID: t.key,
          isTag,
          gameGroupID: group.id,
          gameGroupDisplayName: group.displayName,
          gameID: group.id * 100 + i + 1,
          displayName: `游戏${group.id}-${i + 1}`,
          showStatus: i % 2
        };
      });
      tables.push({ gameTypeID: t.key, isTag, list });
    });
  });
  return tables;
}

export default defineFakeRoute([
  {
    url: "/backend/game/gamelist/type",
    method: "get",
    response: () => ({ success: true, data: { list: gameTypeList } })
  },
  {
    url: "/backend/game/homepage",
    method: "get",
    response: () => ({ success: true, data: { list: buildHomePage() } })
  },
  {
    url: "/backend/game/homepage",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/game/gamegroup/list",
    method: "get",
    response: ({ query }) => {
      let list = gameGroups;
      if (query.gameTypeID) {
        list = list.filter(g => g.gameTypeID === Number(query.gameTypeID));
      }
      return { success: true, data: { list, total: list.length } };
    }
  },
  {
    url: "/backend/game/gamelist/list",
    method: "get",
    response: ({ query }) => {
      const gameGroupID = Number(query.gameGroupID) || 11;
      const list = gamesOfGroup(gameGroupID);
      return { success: true, data: { list, total: list.length } };
    }
  }
]);
