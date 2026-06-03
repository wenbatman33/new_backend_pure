import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 鎖定錢包：status 1 鎖定 / 2 已解鎖 / 3 已還款
const notes = ["風控鎖定", "活動補單", "異常下注鎖定", "客服手動鎖定", ""];
const all = Array.from({ length: 16 }).map((_, i) => ({
  lockID: 1000 + i,
  memberID: 200000 + i,
  memberAccount: `lockuser${i + 1}`,
  lockMoney: Number((Math.random() * 50000 + 1000).toFixed(2)),
  status: (i % 3) + 1,
  note: notes[i % notes.length],
  createdAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 09:15:00`,
  updatedAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 18:42:00`
}));

export default defineFakeRoute([
  {
    url: "/backend/luck_money/wallet/lock/member/list",
    method: "get",
    response: ({ query }) => {
      let list = all;
      if (query.memberID) {
        list = list.filter(v => String(v.memberID).includes(query.memberID));
      }
      if (query.memberAccount) {
        list = list.filter(v => v.memberAccount.includes(query.memberAccount));
      }
      // status=4 視為全部
      if (query.status && Number(query.status) !== 4) {
        list = list.filter(v => v.status === Number(query.status));
      }
      return { success: true, data: { list, total: list.length } };
    }
  },
  {
    url: "/backend/luck_money/wallet/lock/member/unlock",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/luck_money/wallet/lock/member/lockPadding",
    method: "put",
    response: () => ({ success: true, data: null })
  }
]);
