import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 廣告點擊報表 - 每日彙總假資料（13 筆）
const dailyList = Array.from({ length: 13 }).map((_, i) => {
  const clickGuest = 1000 + i * 37;
  const clickMember = 600 + i * 21;
  return {
    date: `2026-05-${String(i + 1).padStart(2, "0")}`,
    clickTotal: clickGuest + clickMember,
    clickGuest,
    clickMember,
    countMember: 300 + i * 11
  };
});

function sum(list: any[], key: string) {
  return list.reduce((acc, cur) => acc + Number(cur[key] || 0), 0);
}

// 詳細記錄假資料（依廣告細分，15 筆）
const detailList = Array.from({ length: 15 }).map((_, i) => {
  const clickGuest = 100 + i * 7;
  const clickMember = 60 + i * 4;
  return {
    bannerID: 2001 + i,
    bannerTitle: `广告活动_${i + 1}`,
    clickTotal: clickGuest + clickMember,
    clickGuest,
    clickMember,
    countMember: 30 + i * 2
  };
});

// 廣告下拉選項假資料
const bannerSelectList = Array.from({ length: 10 }).map((_, i) => ({
  id: 2001 + i,
  title: `广告活动_${i + 1}`
}));

export default defineFakeRoute([
  {
    url: "/backend/report/page/log/view",
    method: "get",
    response: () => {
      const list = dailyList;
      return {
        success: true,
        data: {
          list,
          total: list.length,
          summary: {
            clickTotal: sum(list, "clickTotal"),
            clickGuest: sum(list, "clickGuest"),
            clickMember: sum(list, "clickMember"),
            countMember: sum(list, "countMember")
          }
        }
      };
    }
  },
  {
    url: "/backend/report/page/log/view/detail",
    method: "get",
    response: () => {
      const list = detailList;
      return {
        success: true,
        data: {
          list,
          total: list.length,
          summary: {
            clickTotal: sum(list, "clickTotal"),
            clickGuest: sum(list, "clickGuest"),
            clickMember: sum(list, "clickMember"),
            countMember: sum(list, "countMember")
          }
        }
      };
    }
  },
  {
    url: "/backend/site/banner",
    method: "get",
    response: () => ({
      success: true,
      data: { list: bannerSelectList, total: bannerSelectList.length }
    })
  }
]);
