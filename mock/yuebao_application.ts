import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 状态：3 计息中 / 4 已失效 / 5 待领取 / 6 已领取 / 7 未领取
const statusPool = [3, 4, 5, 6, 7];

const all = Array.from({ length: 16 }).map((_, i) => {
  const status = statusPool[i % statusPool.length];
  const day = String((i % 28) + 1).padStart(2, "0");
  return {
    id: 10000 + i,
    memberID: 200000 + i,
    memberAccount: `member${i + 1}`,
    calcMoney: 10000 + i * 250.5,
    profit: 35.75 + i * 1.2,
    status,
    createdAt: `2026-05-${day} 09:15:00`,
    numero: `2026${day}`,
    sendAt: status >= 5 ? `2026-05-${day} 12:00:00` : "",
    updatedAt: `2026-05-${day} 18:30:00`,
    updatedUser: i % 3 === 0 ? "admin" : "operator01"
  };
});

export default defineFakeRoute([
  {
    url: "/backend/yuebao",
    method: "get",
    response: ({ query }) => {
      let list = all;
      if (query.memberAccount) {
        list = list.filter(v => v.memberAccount.includes(query.memberAccount));
      }
      if (query.status) {
        list = list.filter(v => v.status === Number(query.status));
      }
      if (query.numero) {
        list = list.filter(v => String(v.numero).includes(query.numero));
      }
      if (query.id) {
        list = list.filter(v => String(v.id).includes(query.id));
      }
      // 统计汇总
      const sum = (pred: (v: (typeof all)[number]) => boolean) =>
        list.filter(pred).reduce((acc, v) => acc + v.calcMoney + v.profit, 0);
      return {
        success: true,
        data: {
          list,
          total: list.length,
          count: list.length,
          sendTotal: sum(v => v.status === 7), // 未领取
          reciveTotal: sum(v => v.status === 6), // 已领取
          giveupTotal: sum(v => v.status === 4) // 已失效
        }
      };
    }
  }
]);
