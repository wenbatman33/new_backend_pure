import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 被推荐人假資料（推荐活动报表）
const accounts = [
  "alice01",
  "bob02",
  "carol03",
  "david04",
  "eric05",
  "frank06",
  "grace07",
  "helen08",
  "ivan09",
  "jack10",
  "kevin11",
  "linda12",
  "mike13",
  "nancy14",
  "oscar15",
  "peggy16"
];

const list = accounts.map((account, i) => {
  const bound = i % 3 !== 0;
  return {
    account,
    memberID: 200000 + i,
    isCardBinding: bound,
    cardBindingDate: bound ? `2026-05-${String((i % 28) + 1).padStart(2, "0")}` : "",
    firstDepositAmount: bound ? (i + 1) * 500 : 0,
    firstDepositDate: bound ? `2026-05-${String((i % 28) + 1).padStart(2, "0")}` : "",
    depositAmount: (i + 1) * 1200,
    withdrawAmount: (i + 1) * 300,
    eventTurnover: (i + 1) * 8000,
    winLoseAmount: i % 2 === 0 ? (i + 1) * 200 : -((i + 1) * 150),
    registerDate: `2026-04-${String((i % 28) + 1).padStart(2, "0")}`,
    lastLoginAt: `2026-06-${String((i % 28) + 1).padStart(2, "0")} 12:00:00`
  };
});

// 合計列
const summary = {
  firstDepositAmount: list.reduce((s, v) => s + Number(v.firstDepositAmount), 0),
  depositAmount: list.reduce((s, v) => s + Number(v.depositAmount), 0),
  withdrawAmount: list.reduce((s, v) => s + Number(v.withdrawAmount), 0),
  eventTurnover: list.reduce((s, v) => s + Number(v.eventTurnover), 0),
  winLoseAmount: list.reduce((s, v) => s + Number(v.winLoseAmount), 0)
};

export default defineFakeRoute([
  {
    url: "/backend/event/inviter2023/recommended",
    method: "get",
    response: ({ query }) => {
      let result = list;
      // 簡單模擬「推荐人帐号」搜尋
      if (query.account) {
        result = result.filter(v => v.account.includes(query.account));
      }
      return {
        success: true,
        data: { list: result, total: result.length, summary }
      };
    }
  }
]);
