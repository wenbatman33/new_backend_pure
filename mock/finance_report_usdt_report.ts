import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 科目下拉
const subjects = [
  { subjectID: 1, name: "充值" },
  { subjectID: 2, name: "提现" },
  { subjectID: 3, name: "手续费" },
  { subjectID: 4, name: "内部转帐" }
];

// U 钱包帐户
const ucardList = [
  { id: 1, name: "USDT-TRC20 主钱包" },
  { id: 2, name: "USDT-ERC20 备用钱包" },
  { id: 3, name: "USDT-OMNI 钱包" }
];

// 帐变明细：type 1=收入 2=支出
const targetNames = ["币安交易所", "OKX交易所", "火币", "场外承兑商", "内部钱包"];
let balance = 1_000_000;
const all = Array.from({ length: 16 }).map((_, i) => {
  const type = (i % 2) + 1;
  const amount = (i + 1) * 1234;
  const fee = Math.round(amount * 0.01);
  balance += type === 1 ? amount : -amount;
  return {
    id: i + 1,
    createdAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 10:${String(
      (i % 60)
    ).padStart(2, "0")}:00`,
    subjectID: (i % subjects.length) + 1,
    type,
    amount,
    in: type === 1 ? amount : 0,
    out: type === 2 ? amount : 0,
    fee,
    balance,
    relationID: `ORD${100000 + i}`,
    thirdID: `TX${900000 + i}`,
    targetName: targetNames[i % targetNames.length],
    editorName: i % 3 === 0 ? "admin" : "operator01",
    note: i % 4 === 0 ? "人工调整" : ""
  };
});

export default defineFakeRoute([
  // U 钱包帐变明细
  {
    url: "/backend/pay/usdt/log",
    method: "get",
    response: ({ query }) => {
      let list = all;
      if (query.usdtID) {
        // 简单模拟：按帐户过滤（此处不影响渲染，全量回传）
        list = all;
      }
      const countIn = list.reduce((s, v) => s + (v.in || 0), 0);
      const countOut = list.reduce((s, v) => s + (v.out || 0), 0);
      return {
        success: true,
        data: {
          list,
          total: list.length,
          count: list.length,
          countIn,
          countOut
        }
      };
    }
  },
  // U 钱包帐户下拉
  {
    url: "/backend/pay/usdt",
    method: "get",
    response: () => ({
      success: true,
      data: { list: ucardList, total: ucardList.length }
    })
  },
  // 共用搜寻下拉（仅 subjects 与本模组相关）
  {
    url: "/backend/pay/pay_channel/dropdown",
    method: "get",
    response: () => ({
      success: true,
      data: { subjects }
    })
  },
  // 修改备注
  {
    url: "/backend/pay/usdt/log/note",
    method: "put",
    response: () => ({ success: true, data: null })
  }
]);
