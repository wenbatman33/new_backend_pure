import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 遊戲代理群組假資料
const gameGroups = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  name: `GameAgency${i + 1}`
}));

// 依起始/結束數字產生代理帳號清單
function buildAgencyList(query: any) {
  const prefix = query.accountPrefix || "qatest";
  const start = Number(query.startNumber) || 1;
  const end = Number(query.endNumber) || start;
  const list: Array<{ agency_id: number; agency_account: string }> = [];
  const max = Math.min(end - start + 1, 50); // 上限避免過多
  for (let i = 0; i < max; i++) {
    const num = start + i;
    list.push({
      agency_id: 11000 + num,
      agency_account: `${prefix}${String(num).padStart(3, "0")}`
    });
  }
  return list;
}

export default defineFakeRoute([
  // 遊戲代理群組（卡片三下拉）
  {
    url: "/backend/bettinglog/group/list",
    method: "get",
    response: () => ({ success: true, data: { list: gameGroups } })
  },
  // 卡片一：批次建立代理
  {
    url: "/fake/tools/batchgenagency",
    method: "get",
    response: ({ query }) => ({
      success: true,
      data: { list: buildAgencyList(query) }
    })
  },
  // 卡片二：批次建立代理直屬會員
  {
    url: "/fake/tools/batchgenmember",
    method: "get",
    response: ({ query }) => ({
      success: true,
      data: { list: buildAgencyList(query) }
    })
  },
  // 卡片三：新增存款單與流水
  {
    url: "/fake/tools/makebettingloganddepositbyagencyids",
    method: "get",
    response: ({ query }) => ({
      success: true,
      data: {
        agencyIDs: query.agencyIDs ?? "",
        memberCnt: Number(query.memberCnt) || 0,
        status: "ok"
      }
    })
  },
  // 卡片四：重算全部基本報表
  {
    url: "/backend/report/tool/recalcreportmemberall",
    method: "get",
    response: () => ({ success: true, data: { status: "ok" } })
  },
  // 卡片四：重算代理每日報表
  {
    url: "/backend/report/tool/recalcReportAgencyDaily",
    method: "get",
    response: () => ({ success: true, data: { status: "ok" } })
  },
  // 卡片四：重算代理佣金報表
  {
    url: "/backend/report/tool/recalcAgencyCommissionMonthly",
    method: "get",
    response: () => ({ success: true, data: { status: "ok" } })
  }
]);
