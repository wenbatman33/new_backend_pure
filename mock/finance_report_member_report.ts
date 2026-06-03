import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 三方金流群組假資料
const payGroups = [
  { ID: 1, name: "支付寶群組A" },
  { ID: 2, name: "微信群組B" },
  { ID: 3, name: "USDT群組C" }
];

// 銀行卡金流群組假資料
const bankcardGroups = [
  { ID: 11, name: "工商銀行卡組" },
  { ID: 12, name: "建設銀行卡組" }
];

// 會員存款報表假資料（15 筆）
const memberList = Array.from({ length: 15 }).map((_, i) => {
  const amount = 100000 - i * 3500;
  const maxAmount = Math.round(amount * 0.4);
  const minAmount = Math.round(amount * 0.02);
  const avgAmount = Math.round(amount / (8 + (i % 5)));
  const dayAvgAmount = Math.round(avgAmount / 3);
  return {
    memberID: 200000 + i,
    memberName: `member${String(i + 1).padStart(3, "0")}`,
    amount,
    maxAmount,
    minAmount,
    avgAmount,
    dayAvgAmount,
    payGroupName: payGroups[i % payGroups.length].name,
    bankGroupName: bankcardGroups[i % bankcardGroups.length].name,
    registedDate: `2026-0${(i % 5) + 1}-${String((i % 28) + 1).padStart(2, "0")}`
  };
});

const totalAmount = memberList.reduce((s, v) => s + v.amount, 0);

export default defineFakeRoute([
  {
    // 會員存款報表
    url: "/backend/report/deposit/member_report",
    method: "get",
    response: ({ query }) => {
      let list = memberList;
      // 依顯示筆數截斷（排名）
      if (query.showNum && Number(query.showNum) > 0) {
        list = list.slice(0, Number(query.showNum));
      }
      return {
        success: true,
        data: {
          list,
          total: list.length,
          totalAmount,
          updatedAt: "2026-06-03 08:00:00"
        }
      };
    }
  },
  {
    // 金流群組列表：type=1 三方 / type=2 銀行卡
    url: "/backend/pay_group/groups",
    method: "get",
    response: ({ query }) => {
      const list = Number(query.type) === 2 ? bankcardGroups : payGroups;
      return { success: true, data: { list, total: list.length } };
    }
  }
]);
