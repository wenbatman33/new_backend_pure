import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 輸贏報表假資料（16 筆）
const list = Array.from({ length: 16 }).map((_, i) => {
  const profit = (i % 4 === 0 ? -1 : 1) * (10000 + i * 1357);
  return {
    topAgencyID: i % 5 === 0 ? 0 : 2000 + i,
    agencyID: 3000 + i,
    memberID: 100000 + i,
    memberAccount: `member${i + 1}`,
    betCnt: 50 + i * 7,
    betAmount: 50000 + i * 3210,
    eventBetAmount: 12000 + i * 880,
    killNum: (i % 3 === 0 ? -1 : 1) * (i * 120),
    profit,
    deposit: 20000 + i * 1500,
    depositCount: 3 + (i % 6),
    withdraw: 15000 + i * 1100,
    withdrawCount: 2 + (i % 5),
    bonus: 500 + i * 60
  };
});

export default defineFakeRoute([
  {
    // 輸贏報表列表
    url: "/backend/report/winner",
    method: "get",
    response: () => {
      return {
        success: true,
        data: {
          list,
          total: list.length,
          updatedAt: "2026-06-02 23:59:59"
        }
      };
    }
  },
  {
    // 匯出排行榜
    url: "/backend/report/winner/rank",
    method: "get",
    response: () => ({ success: true, data: null })
  },
  {
    // 遊戲廠商群組清單（搜尋下拉用）
    url: "/backend/bettinglog/group/list",
    method: "get",
    response: () => {
      const groups = Array.from({ length: 10 }).map((_, i) => ({
        id: i + 1,
        name: `Game Group ${i + 1}`
      }));
      return { success: true, data: { list: groups } };
    }
  }
]);
