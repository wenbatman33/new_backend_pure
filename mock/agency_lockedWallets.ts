import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 鎖定錢包假資料：status 1 鎖定中 / 2 已解鎖
const notes = ["风控锁定", "异常提现", "套利标记", "待审核", "客服锁定"];
const all = Array.from({ length: 16 }).map((_, i) => ({
  lockID: i + 1,
  agencyID: 200000 + i,
  agencyAccount: `agency${i + 1}`,
  status: (i % 2) + 1,
  note: notes[i % notes.length],
  createdAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 10:30:00`,
  updatedAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 12:45:00`
}));

export default defineFakeRoute([
  {
    url: "/backend/wallet/lock/agency/list",
    method: "get",
    response: ({ query }) => {
      let list = all;
      if (query.status) {
        list = list.filter(v => v.status === Number(query.status));
      }
      return { success: true, data: { list, total: list.length } };
    }
  },
  {
    url: "/backend/wallet/lock/agency/unlock",
    method: "put",
    response: () => ({ success: true, data: null })
  }
]);
