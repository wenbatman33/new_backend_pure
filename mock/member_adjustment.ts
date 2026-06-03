import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 產生申請名單會員
function makeMembers(seed: number, count: number) {
  return Array.from({ length: count }).map((_, i) => ({
    memberID: 200000 + seed * 10 + i,
    memberAccount: `member${seed}_${i + 1}`,
    amount: (seed + 1) * 100 + i * 10,
    status: ((seed + i) % 2) + 1,
    reason: (seed + i) % 2 === 0 ? "" : "金额异常",
    lockID: seed * 100 + i
  }));
}

const all = Array.from({ length: 16 }).map((_, i) => {
  const memberList = makeMembers(i, (i % 4) + 2);
  const applyCount = memberList.length;
  const passCount = memberList.filter(m => m.status === 1).length;
  return {
    adjustmentID: 1000 + i,
    subject: `调整申请单 #${1000 + i}`,
    type: (i % 3) + 1, // 1 中心钱包 / 2 新增彩金钱包 / 3 既有彩金钱包
    reason: (i % 15) + 1,
    description: `调整说明内容 ${i + 1}`,
    feDescription: `前台说明 ${i + 1}`,
    status: (i % 4) + 1, // 1/2/3/4
    createdAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 09:15:00`,
    updatedAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 18:40:00`,
    applyCount,
    passCount,
    adjustmentType: i % 2 === 0 ? "1" : "2", // 1 上分 / 2 下分
    amountTimes: String((i % 5) + 1),
    currency: "RMB",
    createUser: i % 3 === 0 ? "admin" : "operator01",
    verifyUser: i % 4 === 0 ? "auditor01" : "",
    memberList
  };
});

export default defineFakeRoute([
  {
    url: "/backend/adjustment/list",
    method: "get",
    response: ({ query }) => {
      let list = all;
      if (query.subject) {
        list = list.filter(v => v.subject.includes(query.subject));
      }
      if (query.status && Number(query.status) !== 0) {
        list = list.filter(v => v.status === Number(query.status));
      }
      if (query.type && Number(query.type) !== 0) {
        list = list.filter(v => v.type === Number(query.type));
      }
      return { success: true, data: { list, total: list.length } };
    }
  },
  {
    url: "/backend/adjustment/delete",
    method: "delete",
    response: () => ({ success: true, data: null })
  },
  {
    // 審核申請單（沿用舊 endpoint /backend/adjustment/verify, PUT）
    url: "/backend/adjustment/verify",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/adjustment/turnover/list",
    method: "get",
    response: () => ({ success: true, data: { list: [], total: 0 } })
  }
]);
