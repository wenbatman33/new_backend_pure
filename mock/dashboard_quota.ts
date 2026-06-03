import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 主頁圖表資料：24 個時段輸贏
const chartList = Array.from({ length: 24 }).map((_, i) => ({
  date: `2026-06-03 ${String(i).padStart(2, "0")}:00:00`,
  winAmount: Math.round((Math.random() - 0.4) * 100000)
}));

// 站台水位資訊
const quotaInfo = {
  websiteName: "LuckSite",
  verify: true,
  percent: 63.27,
  siteQuotaMoney: 1234567.89,
  quota: 5000000,
  winAmount: 3162340.5,
  settlementDate: "2026-05-31",
  configWinAmount: 280450.75,
  list: chartList
};

// 入金明細（log）
const useTypes = [1, 2, 3, 4, 5];
const logList = Array.from({ length: 15 }).map((_, i) => ({
  id: i + 1,
  createdAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 09:15:00`,
  useType: useTypes[i % useTypes.length],
  beforeMoney: 1000000 + i * 5000,
  adjustMoney: (i % 2 === 0 ? 1 : -1) * (10000 + i * 1000),
  afterMoney: 1010000 + i * 4000,
  updatedAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 09:16:00`,
  updatedUser: i % 3 === 0 ? "admin" : "operator01"
}));

// 額度異動日報
const adjustList = Array.from({ length: 12 }).map((_, i) => ({
  date: `2026-06-${String((i % 28) + 1).padStart(2, "0")}`,
  useType: useTypes[i % useTypes.length],
  adjustBalance: (i % 2 === 0 ? 1 : -1) * (20000 + i * 1500),
  balance: 3000000 - i * 12000
}));

// 月額度統計報表
const monthList = Array.from({ length: 12 }).map((_, i) => {
  const m = String(i + 1).padStart(2, "0");
  return {
    date: `2026-${m}`,
    quota: 5000000,
    winAmount: Math.round((Math.random() - 0.3) * 4000000)
  };
});

export default defineFakeRoute([
  // 1. 站台水位資訊
  {
    url: "/backend/site/quota",
    method: "get",
    response: () => ({ success: true, data: quotaInfo })
  },
  // 2. 水位用量百分比
  {
    url: "/backend/site/quota/percent",
    method: "get",
    response: () => ({
      success: true,
      data: { percent: quotaInfo.percent }
    })
  },
  // 3. 入金明細查詢
  {
    url: "/backend/site/quota/log",
    method: "get",
    response: () => ({
      success: true,
      data: { list: logList, total: logList.length }
    })
  },
  // 4. 新增入金明細
  {
    url: "/backend/site/quota/log",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  // 5. 結算
  {
    url: "/backend/site/quota/settlement",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  // 6. 更新水位開關設定
  {
    url: "/backend/site/quota/config",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  // 7. 更新站台名稱
  {
    url: "/backend/site/quota/config/name",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  // 8. 額度異動日報
  {
    url: "/backend/site/quota/adjust/list",
    method: "get",
    response: () => ({
      success: true,
      data: { list: adjustList, total: adjustList.length }
    })
  },
  // 9. 月額度統計報表查詢
  {
    url: "/backend/site/quota/report/month",
    method: "get",
    response: () => ({
      success: true,
      data: { list: monthList, total: monthList.length }
    })
  },
  // 10. 月額度統計報表重新產生
  {
    url: "/backend/site/quota/report/month",
    method: "post",
    response: () => ({ success: true, data: null })
  }
]);
