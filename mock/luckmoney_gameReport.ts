import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 產生 15 筆遊戲報表假資料
const list = Array.from({ length: 15 }).map((_, i) => {
  const win = (Math.random() - 0.4) * 200000;
  const bet = 500000 + i * 30000;
  return {
    reportDate: `2026-05-${String((i % 28) + 1).padStart(2, "0")}`,
    betAmount: bet,
    kill: Number(((win / bet) * 100).toFixed(2)),
    winAmount: Number(win.toFixed(2)),
    betPeople: 100 + i * 7,
    betCount: 3000 + i * 120
  };
});

// 合計列
const total = {
  betAmount: list.reduce((s, v) => s + Number(v.betAmount), 0),
  kill: 1.23,
  winAmount: list.reduce((s, v) => s + Number(v.winAmount), 0),
  betPeople: list.reduce((s, v) => s + Number(v.betPeople), 0),
  betCount: list.reduce((s, v) => s + Number(v.betCount), 0),
  lastUpdatedAt: "2026-06-02 23:59:59"
};

// 遊戲類型清單（OriginGameListType：{ key, value }）
const gameTypeList = [
  { key: "1", value: "电子" },
  { key: "2", value: "棋牌" },
  { key: "3", value: "捕鱼" },
  { key: "4", value: "真人" }
];

// 遊戲廠商清單（GameGroupsList：{ id, displayName }）
const gameGroupList = [
  { id: "101", displayName: "PG电子" },
  { id: "102", displayName: "PP电子" },
  { id: "103", displayName: "JDB电子" }
];

export default defineFakeRoute([
  {
    url: "/backend/report/game/lm",
    method: "get",
    response: () => ({ success: true, data: { list, total } })
  },
  {
    url: "/backend/game/gamelist/type",
    method: "get",
    response: () => ({ success: true, data: { list: gameTypeList } })
  },
  {
    url: "/backend/game/luckmoney/gamegroup/list",
    method: "get",
    response: () => ({ success: true, data: { list: gameGroupList } })
  }
]);
