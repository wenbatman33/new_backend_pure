import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 状态：1 锁定中 / 2 已解锁 / 3 已退回
const notes = ["风控锁定", "异常出款", "活动违规", "人工标记"];
const all = Array.from({ length: 16 }).map((_, i) => ({
  lockID: 1000 + i,
  memberID: 200000 + i,
  memberAccount: `member${i + 1}`,
  lockMoney: Number((Math.random() * 50000 + 100).toFixed(2)),
  status: (i % 3) + 1,
  note: notes[i % notes.length],
  createdAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 09:15:00`,
  updatedAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 18:40:00`
}));

export default defineFakeRoute([
  {
    url: "/backend/wallet/lock/member/list",
    method: "get",
    response: ({ query }) => {
      let list = all;
      // status=4 视为全部
      if (query.status && Number(query.status) !== 4) {
        list = list.filter(v => v.status === Number(query.status));
      }
      if (query.memberID) {
        list = list.filter(v => String(v.memberID).includes(query.memberID));
      }
      if (query.memberAccount) {
        list = list.filter(v => v.memberAccount.includes(query.memberAccount));
      }
      return { success: true, data: { list, total: list.length } };
    }
  },
  {
    url: "/backend/wallet/lock/member/unlock",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/Wallet/Lock/Member/lockPadding",
    method: "put",
    response: () => ({ success: true, data: null })
  }
]);
