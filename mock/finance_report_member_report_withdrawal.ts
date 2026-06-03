import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 會員提款統計報表假資料
const reportList = Array.from({ length: 16 }).map((_, i) => {
  const amount = 50000 - i * 2500 + (i % 3) * 800;
  const maxAmount = amount * 0.4;
  const minAmount = amount * 0.02;
  const avgAmount = amount * 0.15;
  const dayAvgAmount = amount * 0.08;
  return {
    memberID: 200000 + i,
    memberName: `withdraw_member${i + 1}`,
    amount,
    maxAmount,
    minAmount,
    avgAmount,
    dayAvgAmount,
    payGroupName: i % 2 === 0 ? "三方A组" : "三方B组",
    bankGroupName: i % 3 === 0 ? "银行卡甲组" : "银行卡乙组",
    registedDate: `2026-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, "0")}`
  };
});

export default defineFakeRoute([
  {
    // 取得會員提款報表
    url: "/backend/report/Withdraw/member_report",
    method: "get",
    response: ({ query }) => {
      const showNum = query?.showNum ? Number(query.showNum) : 0;
      const list = showNum > 0 ? reportList.slice(0, showNum) : reportList;
      return {
        success: true,
        data: {
          list,
          total: list.length,
          totalAmount: reportList.reduce((s, v) => s + Number(v.amount), 0),
          updatedAt: "2026-06-02 08:00:00"
        }
      };
    }
  }
  // 註：/backend/pay_group/groups（金流群組選項）為共用 endpoint，
  // 已由其他模組 mock 提供，這裡不重複註冊以避免路由衝突。
]);
