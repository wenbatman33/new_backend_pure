import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 自訂會員報表清單假資料
const list = Array.from({ length: 14 }).map((_, i) => ({
  id: i + 1,
  title: `會员报表 ${i + 1}`,
  description: i % 3 === 0 ? "高净值会员筛选" : "活跃会员分析",
  updatedAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 14:20:00`,
  editor: i % 2 === 0 ? "admin" : "operator01"
}));

// 單筆完整資料（編輯/複製/檢視用）
function buildDetail(id: number) {
  return {
    id,
    title: `会员报表 ${id}`,
    description: "高净值会员筛选",
    start: "2026-05-01 00:00:00",
    end: "2026-05-31 23:59:59",
    requestData: {
      memberStatus: "1",
      agencyID: "A10086",
      loginCount: "10",
      loginCountSign: "3",
      vipLevel: [1, 2],
      memberCreatedAtStart: "2026-01-01 00:00:00",
      memberCreatedAtEnd: "2026-05-31 23:59:59"
    },
    responseData: {
      memberStatus: 1,
      agencyID: 1,
      loginCount: 1,
      vipLevel: 1,
      memberCreatedAt: 0,
      money: 1,
      depositAmount: 1
    }
  };
}

// 報表查詢結果假資料
const reportList = Array.from({ length: 12 }).map((_, i) => ({
  id: 200000 + i,
  account: `member${i + 1}`,
  memberStatus: String((i % 3) + 1),
  memberCreatedAt: "2026-03-15 09:00:00",
  agencyID: "A10086",
  topAgencyID: "T100",
  loginCount: 10 + i,
  money: (1000 + i * 50).toFixed(2),
  vipLevel: (i % 3) + 1,
  depositAmount: (5000 + i * 100).toFixed(2)
}));

export default defineFakeRoute([
  {
    url: "/backend/report/custom/list",
    method: "get",
    response: ({ query }) => {
      let data = list;
      if (query.id) {
        data = data.filter(v => String(v.id) === String(query.id));
      }
      if (query.title) {
        data = data.filter(v => v.title.includes(query.title));
      }
      return { success: true, data: { list: data, total: data.length } };
    }
  },
  {
    // 取得單筆（編輯/複製/檢視）
    url: "/backend/report/custom",
    method: "get",
    response: ({ query }) => {
      return { success: true, data: buildDetail(Number(query.id) || 1) };
    }
  },
  {
    url: "/backend/report/custom",
    method: "post",
    response: () => ({ success: true, data: { id: Date.now() } })
  },
  {
    url: "/backend/report/custom",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/report/custom",
    method: "delete",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/report/custom/report",
    method: "get",
    response: () => ({
      success: true,
      data: { list: reportList, total: reportList.length }
    })
  },
  {
    // VIP 等級設定清單
    url: "/backend/member/vip/setting/list",
    method: "get",
    response: () => ({
      success: true,
      data: {
        list: Array.from({ length: 6 }).map((_, i) => ({ level: i + 1 }))
      }
    })
  }
]);
