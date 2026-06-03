import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 狀態：1待處理 2待出款 3退回 4出款中 5完成 6出款失敗
// 風控：1待審 2審核中 3通過 4免審
const statusValue: Record<number, string> = {
  1: "待处理",
  2: "待出款",
  3: "退回",
  4: "出款中",
  5: "完成",
  6: "出款失败"
};
const riskValue: Record<number, string> = {
  1: "待审",
  2: "审核中",
  3: "通过",
  4: "免审"
};
const banks = ["工商银行", "建设银行", "招商银行", "农业银行", "中国银行"];

function pad(n: number) {
  return String(n).padStart(2, "0");
}

const all = Array.from({ length: 16 }).map((_, i) => {
  const statusKey = (i % 6) + 1;
  const riskKey = (i % 4) + 1;
  const financialKey = (i % 3) + 1;
  const day = pad((i % 28) + 1);
  return {
    transactionID: `WD2026060${pad(i + 1)}00000${i + 1}`,
    transactionTime: `2026-06-01 ${pad(8 + (i % 10))}:${pad(i * 3)}:00`,
    agencyID: `AG${1000 + i}`,
    member: {
      key: String(200000 + i),
      value: { account: `member${i + 1}` }
    },
    bankAccount: `张三${i + 1}`,
    status: { key: statusKey, value: statusValue[statusKey] },
    amount: (i + 1) * 1500,
    bankName: banks[i % banks.length],
    bankCode: `BANK00${i % banks.length}`,
    memberBankNo: `622848${100000000 + i}`,
    financialCheck: {
      key: financialKey,
      value: financialKey === 1 ? "待审" : financialKey === 3 ? "通过" : "退回"
    },
    riskCheck: { key: riskKey, value: riskValue[riskKey] },
    riskCheckName: i % 2 === 0 ? "riskadmin01" : "",
    lastUpdate: `2026-06-0${(i % 5) + 1} ${pad(10 + (i % 8))}:${pad(i * 2)}:00`,
    updatedBy: i % 3 === 0 ? "admin" : "operator01",
    remark: i % 4 === 0 ? `备注${i + 1}` : ""
  };
});

export default defineFakeRoute([
  {
    // 提款風控列表（沿用舊 endpoint，source=1）
    url: "/backend/withdrawal",
    method: "get",
    response: ({ query }) => {
      let list = all;
      if (query.memberAccount) {
        list = list.filter(v =>
          v.member.value.account.includes(query.memberAccount)
        );
      }
      if (query.orderSn) {
        list = list.filter(v => v.transactionID.includes(query.orderSn));
      }
      if (query.status) {
        list = list.filter(v => v.status.key === Number(query.status));
      }
      if (query.riskCheck) {
        list = list.filter(v => v.riskCheck.key === Number(query.riskCheck));
      }
      const total = list.reduce((s, v) => s + v.amount, 0);
      return {
        success: true,
        data: {
          list,
          total: list.length,
          count: list.length,
          total_amount: total,
          fee: 0
        }
      };
    }
  },
  {
    // 風控進入審核：回傳 adminAccount 為空字串代表可進入審核
    url: "/backend/withdrawal/riskaudit",
    method: "post",
    response: () => ({
      success: true,
      data: { adminAccount: "" }
    })
  }
]);
