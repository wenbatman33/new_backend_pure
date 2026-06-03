import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 產 15 筆遊戲報表假資料
const list = Array.from({ length: 15 }).map((_, i) => {
  const day = String((i % 28) + 1).padStart(2, "0");
  const win = (Math.random() * 200000 - 100000).toFixed(2);
  return {
    reportDate: `2026-05-${day}`,
    betAmount: (Math.random() * 5000000 + 100000).toFixed(2),
    kill: (Math.random() * 20 - 5).toFixed(2),
    winAmount: win,
    betPeople: Math.floor(Math.random() * 5000 + 100),
    betCount: Math.floor(Math.random() * 50000 + 1000)
  };
});

// 合計列
const total = {
  betAmount: list
    .reduce((s, v) => s + Number(v.betAmount), 0)
    .toFixed(2),
  kill: "3.21",
  winAmount: list
    .reduce((s, v) => s + Number(v.winAmount), 0)
    .toFixed(2),
  betPeople: list.reduce((s, v) => s + Number(v.betPeople), 0),
  betCount: list.reduce((s, v) => s + Number(v.betCount), 0),
  lastUpdatedAt: "2026-06-02 08:00:00"
};

export default defineFakeRoute([
  {
    url: "/backend/report/game",
    method: "get",
    response: () => ({
      success: true,
      data: { list, total }
    })
  },
  {
    url: "/backend/report/game/refresh",
    method: "get",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/report/game/export",
    method: "get",
    response: () => ({ success: true, data: null })
  }
]);
