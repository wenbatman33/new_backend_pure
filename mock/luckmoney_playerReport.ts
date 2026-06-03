import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 玩家報表假資料
const accounts = ["winner01", "lucky88", "player777", "fish_king", "vipgold"];
const list = Array.from({ length: 16 }).map((_, i) => {
  const profit = (i % 3 === 0 ? -1 : 1) * (1000 + i * 137.5);
  return {
    agencyID: 9000 + (i % 5),
    memberID: 200000 + i,
    memberAccount: `${accounts[i % accounts.length]}${i}`,
    betCnt: 50 + i * 7,
    betAmount: 10000 + i * 523.45,
    killNum: i % 4 === 0 ? -3 : i % 10,
    profit,
    deposit: 5000 + i * 210.5,
    withdraw: 3000 + i * 180.25,
    bonus: i % 2 === 0 ? 88.8 + i : 0,
    depositAmount: 2000 + i * 99.99,
    withdrawalAmount: 1500 + i * 77.7,
    promotionList:
      i % 3 === 0
        ? {}
        : {
            a: { id: 100 + i, name: `新人活动${i}` },
            b: { id: 200 + i, name: `周末加码${i}` }
          }
  };
});

const groups = [
  { ID: 1, name: "PG电子" },
  { ID: 2, name: "JILI吉利" },
  { ID: 3, name: "CQ9电子" },
  { ID: 4, name: "MG电子" }
];

export default defineFakeRoute([
  {
    url: "/backend/report/winner/lm",
    method: "get",
    response: ({ query }) => {
      let result = list;
      if (query.memberAccount) {
        result = result.filter(v => v.memberAccount.includes(query.memberAccount));
      }
      if (query.agencyID) {
        result = result.filter(v => String(v.agencyID).includes(query.agencyID));
      }
      return { success: true, data: { list: result, total: result.length } };
    }
  },
  {
    url: "/backend/bettinglog/luckmoney/group/list",
    method: "get",
    response: () => ({ success: true, data: { list: groups } })
  }
]);
