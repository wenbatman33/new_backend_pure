import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 紅包遊戲代理商假資料
const gameGroupsPool = [
  ["PG", "JILI"],
  ["CQ9", "PG"],
  ["JDB"],
  ["BNG", "PG", "JILI"],
  ["AMEBA"]
];
const gameListsPool = [
  ["电子", "捕鱼"],
  ["真人"],
  ["电子"],
  ["棋牌", "电子"],
  ["彩票"]
];

const all = Array.from({ length: 15 }).map((_, i) => ({
  id: i + 1,
  name: `LM代理商${i + 1}`,
  gameGroups: gameGroupsPool[i % gameGroupsPool.length],
  gameLists: gameListsPool[i % gameListsPool.length],
  // 狀態：1 開啟 / 2 關閉 / 3 維護中 / 4 隱藏
  status: (i % 4) + 1,
  gameTypeID: (i % 3) + 1
}));

// 遊戲類型下拉
const gameTypes = [
  { key: 1, value: "电子" },
  { key: 2, value: "真人" },
  { key: 3, value: "捕鱼" }
];

export default defineFakeRoute([
  {
    url: "/backend/game/luckmoney/gameagency/list",
    method: "get",
    response: ({ query }) => {
      let list = all;
      if (query.name) {
        list = list.filter(v => v.name.includes(query.name));
      }
      if (query.gameTypeID) {
        list = list.filter(v => v.gameTypeID === Number(query.gameTypeID));
      }
      if (query.status && Number(query.status) !== 0) {
        list = list.filter(v => v.status === Number(query.status));
      }
      return { success: true, data: { list, total: list.length } };
    }
  },
  {
    url: "/backend/game/gamelist/type",
    method: "get",
    response: () => ({ success: true, data: { list: gameTypes } })
  },
  {
    url: "/backend/game/luckmoney/gameagency",
    method: "put",
    response: () => ({ success: true, data: null })
  }
]);
