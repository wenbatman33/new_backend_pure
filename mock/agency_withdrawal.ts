import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 提款狀態 1~6；財務/風控審核 1~3,6
const banks = ["工商银行", "建设银行", "招商银行", "农业银行"];
const list = Array.from({ length: 16 }).map((_, i) => {
  const statusKey = (i % 6) + 1;
  const checkKey = [1, 2, 3, 6][i % 4];
  return {
    transactionID: `AW${20260603000 + i}`,
    transactionTime: `2026-06-0${(i % 9) + 1} 09:${String((i * 3) % 60).padStart(
      2,
      "0"
    )}:00`,
    amount: 1000 + i * 250,
    member: { key: 500000 + i, value: { account: `agency${i + 1}` } },
    bankAccount: `BA${1000 + i}`,
    snList: [`SN${i}A`, `SN${i}B`],
    bankCode: `BK${100 + i}`,
    bankName: banks[i % banks.length],
    memberBankNo: `622202${String(1000000 + i)}`,
    status: { key: statusKey, value: `status${statusKey}` },
    financialCheck: { key: checkKey, value: `fc${checkKey}` },
    riskCheck: { key: checkKey, value: `rc${checkKey}` },
    lastUpdate: `2026-06-0${(i % 9) + 1} 10:${String((i * 5) % 60).padStart(
      2,
      "0"
    )}:00`,
    updatedBy: i % 2 === 0 ? "admin" : "operator01"
  };
});

export default defineFakeRoute([
  {
    // 提款列表
    url: "/backend/withdrawal",
    method: "get",
    response: ({ query }) => {
      let result = list;
      if (query.status) {
        result = result.filter(v => v.status.key === Number(query.status));
      }
      if (query.memberAccount) {
        result = result.filter(v =>
          v.member.value.account.includes(query.memberAccount)
        );
      }
      if (query.orderSn) {
        result = result.filter(v => v.transactionID.includes(query.orderSn));
      }
      const total = result.reduce((s, v) => s + Number(v.amount), 0);
      const fee = Math.round(total * 0.01);
      return {
        success: true,
        data: {
          list: result,
          total: result.length,
          count: result.length,
          // 統計合計
          fee,
          erctotal: 12000,
          trctotal: 8000
        }
      };
    }
  },
  {
    // 財務進入審核 / 後台代提新增
    url: "/backend/withdrawal/audit",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  {
    // 快速出款
    url: "/backend/withdrawal/payout/quick",
    method: "post",
    response: () => ({ success: true, data: null })
  }
]);
