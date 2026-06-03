import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 代理申請審核 mock
// businessType: 0 直營 / 1 全反水 / 2 淨利
// auditStatus: 1 待審核 / 2 通過 / 3 拒絕
const names = ["王小明", "李大同", "張美玲", "陳志強", "林雅婷", "黃國華"];
const all = Array.from({ length: 16 }).map((_, i) => {
  const auditStatus = (i % 3) + 1; // 1/2/3 輪替
  const reviewed = auditStatus !== 1;
  return {
    id: i + 1,
    businessType: i % 3,
    memberID: 200000 + i,
    agencyAccount: `agency${i + 1}`,
    name: names[i % names.length],
    phone: `09${String(10000000 + i).slice(0, 8)}`,
    email: `agency${i + 1}@example.com`,
    telegram: `@agency${i + 1}`,
    whatsapp: `+8869${String(10000000 + i).slice(0, 8)}`,
    qqAccount: `${800000 + i}`,
    wechatAccount: `wx_agency${i + 1}`,
    createdAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 09:15:00`,
    reviewTime: reviewed
      ? `2026-05-${String((i % 28) + 1).padStart(2, "0")} 14:30:00`
      : "",
    adminAccount: reviewed ? (i % 2 === 0 ? "admin" : "auditor01") : "",
    adminUserID: reviewed ? 1000 + i : "",
    auditStatus,
    remark: reviewed ? "審核備註內容" : "",
    promoteDescription: "透過官方推廣連結申請"
  };
});

export default defineFakeRoute([
  // 列表
  {
    url: "/backend/agency/application/list",
    method: "get",
    response: ({ query }) => {
      let list = all;
      if (query.id) {
        list = list.filter(v => String(v.id).includes(String(query.id)));
      }
      if (query.agencyAccount) {
        list = list.filter(v =>
          v.agencyAccount.includes(String(query.agencyAccount))
        );
      }
      if (query.auditStatus && Number(query.auditStatus) !== 0) {
        list = list.filter(v => v.auditStatus === Number(query.auditStatus));
      }
      return { success: true, data: { list, total: list.length } };
    }
  },
  // 詳情（依 id）
  {
    url: "/backend/agency/application",
    method: "get",
    response: ({ query }) => {
      const item = all.find(v => String(v.id) === String(query.id)) ?? all[0];
      return { success: true, data: item };
    }
  },
  // 審核（通過/拒絕）
  {
    url: "/backend/agency/application/review",
    method: "put",
    response: ({ body }) => {
      return { success: true, data: { id: body?.id ?? 0 } };
    }
  },
  // 等級群組設定（審核對話框用）
  {
    url: "/backend/agency/ranksetting/all",
    method: "get",
    response: () => {
      const list = Array.from({ length: 5 }).map((_, i) => ({
        value: i + 1,
        label: `等級群組 ${i + 1}`
      }));
      return { success: true, data: { list } };
    }
  }
]);
