import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 會員換線列表假資料
const list = Array.from({ length: 16 }).map((_, i) => ({
  memberID: 200000 + i,
  memberAccount: `member${i + 1}`,
  memberName: `會員${i + 1}`,
  orgAgencyID: 9000 + i,
  orgAgencyAccount: `oldAgency${i + 1}`,
  newAgencyID: 9500 + i,
  newAgencyAccount: `newAgency${i + 1}`,
  date: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 14:20`,
  remark: i % 2 === 0 ? "市場調整換線" : "客戶要求"
}));

export default defineFakeRoute([
  // 換線列表
  {
    url: "/backend/member/node/list",
    method: "get",
    response: ({ query }) => {
      let data = list;
      if (query.memberID) {
        data = data.filter(v => String(v.memberID).includes(query.memberID));
      }
      if (query.agencyAccount) {
        data = data.filter(v =>
          v.orgAgencyAccount.includes(query.agencyAccount)
        );
      }
      return { success: true, data: { list: data, total: data.length } };
    }
  },
  // 查詢會員
  {
    url: "/backend/member/node/checkmember",
    method: "get",
    response: ({ query }) => ({
      success: true,
      data: {
        id: 200001,
        name: "測試會員",
        phone: "0912345678",
        betAmount: 158000,
        totalAmount: 320000,
        depositAmount: 50000,
        parentAgencyID: 9001,
        parentAgencyName: "原代理A",
        parentAgencyAccount: query.account || "oldAgency1",
        memberTags: [
          { id: 1, name: "VIP", color: "gold" },
          { id: 2, name: "高活躍", color: "green" }
        ]
      }
    })
  },
  // 查詢代理
  {
    url: "/backend/member/node/checkagency",
    method: "get",
    response: ({ query }) => ({
      success: true,
      data: {
        id: 9521,
        name: "目標代理B",
        account: query.account || "newAgency1"
      }
    })
  },
  // 執行換線
  {
    url: "/backend/member/node",
    method: "post",
    response: () => ({ success: true, data: { id: 99999 } })
  }
]);
