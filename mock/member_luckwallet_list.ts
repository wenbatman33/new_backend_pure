import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 禮金錢包列表假資料
// status: 1 成立 / 2 進行中 / 3 處理中 / 4 結束(關閉) / 5 結束(凍結)
const sources = ["系統", "人工"];
const names = ["新會員禮金", "週週紅包", "VIP 加碼", "首儲禮金", "活動回饋"];

const all = Array.from({ length: 16 }).map((_, i) => ({
  id: 5000 + i,
  createdAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 09:15:00`,
  name: names[i % names.length],
  status: (i % 5) + 1,
  initialMoney: 100 + i * 50,
  totalBonus: 20 + i * 5,
  money: 80 + i * 30,
  adjustMoney: i % 3 === 0 ? 10 : 0,
  maxWithdrawal: 5000,
  expirationDate: `2026-06-${String((i % 28) + 1).padStart(2, "0")} 23:59:59`,
  orderID: `ORD${20260500 + i}`,
  source: sources[i % sources.length],
  gameItem: [
    { gameGroupName: "電子游戏" },
    { gameGroupName: i % 2 === 0 ? "真人娱乐" : null }
  ],
  assignedGameGroup: i % 2 === 0 ? "指定 A 厂商" : "不限",
  gameAccount: `game_acc_${i + 1}`,
  gameAccountCreatedAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 09:20:00`,
  updatedAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 18:40:00`
}));

export default defineFakeRoute([
  {
    url: "/backend/memberluckmoneywallet/list",
    method: "get",
    response: ({ query }) => {
      let list = all;
      if (query.status) {
        list = list.filter(v => v.status === Number(query.status));
      }
      if (query.name) {
        list = list.filter(v => v.name.includes(query.name));
      }
      if (query.id) {
        list = list.filter(v => String(v.id).includes(query.id));
      }
      if (query.orderID) {
        list = list.filter(v => v.orderID.includes(query.orderID));
      }
      return { success: true, data: { list, total: list.length } };
    }
  },
  {
    url: "/backend/luck_money/wallet/close",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/luck_money/wallet/freeze",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/luck_money/wallet/unfreeze",
    method: "put",
    response: () => ({ success: true, data: null })
  }
]);
