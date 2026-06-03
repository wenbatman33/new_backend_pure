import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 提款管理 mock：列表 /backend/withdrawal、提示音 /backend/payment/beep
// status/financialCheck/riskCheck 皆為 { key, value } 鍵值物件
const statusKV = [
  { key: 1, value: "待审核" },
  { key: 2, value: "待出款" },
  { key: 3, value: "退回" },
  { key: 4, value: "出款中" },
  { key: 5, value: "成功" },
  { key: 6, value: "失败" }
];
const financialKV = [
  { key: 1, value: "待审核" },
  { key: 2, value: "退回" },
  { key: 3, value: "完成" },
  { key: 6, value: "审核中" }
];
const riskKV = [
  { key: 1, value: "待审核" },
  { key: 2, value: "退回" },
  { key: 3, value: "通过" },
  { key: 4, value: "免审" }
];
const banks = ["工商银行", "建设银行", "招商银行", "中国银行", "农业银行"];

const list = Array.from({ length: 16 }).map((_, i) => {
  const day = String((i % 28) + 1).padStart(2, "0");
  const hour = String((i % 24)).padStart(2, "0");
  const time = `2026-06-${day} ${hour}:15:30`;
  return {
    transactionID: `WD2026060${String(100000 + i)}`,
    transactionTime: time,
    amount: 1000 * (i + 1),
    payAmount: 1000 * (i + 1) - 10,
    status: statusKV[i % statusKV.length],
    bankGroup: { key: (i % 3) + 1, value: `卡组${(i % 3) + 1}` },
    thirdGroup: { key: (i % 2) + 1, value: `三方${(i % 2) + 1}` },
    member: {
      key: 100000 + i,
      value: { account: `member${i + 1}`, name: `会员${i + 1}` }
    },
    bankAccount: `户名${i + 1}`,
    bankCode: `00${i % 9}`,
    bankName: banks[i % banks.length],
    memberBankNo: `622848${String(10000000 + i)}`,
    snList: [`SN${1000 + i}`, `SN${2000 + i}`],
    agencyName: i % 2 === 0 ? `代理${i}` : "",
    agencyID: `AG${i}`,
    financialCheck: financialKV[i % financialKV.length],
    riskCheck: riskKV[i % riskKV.length],
    riskCheckName: i % 2 === 0 ? "风控A" : "风控B",
    lastUpdate: time,
    updatedBy: i % 3 === 0 ? "admin" : "operator01",
    remark: i % 4 === 0 ? "备注信息" : "",
    creditDate: `2026-06-${day}`,
    isWithdrawalColor: i % 5 === 0
  };
});

export default defineFakeRoute([
  {
    url: "/backend/withdrawal",
    method: "get",
    response: ({ query }) => {
      let result = list;
      if (query.memberAccount) {
        result = result.filter(v =>
          v.member.value.account.includes(query.memberAccount)
        );
      }
      if (query.orderSn) {
        result = result.filter(v => v.transactionID.includes(query.orderSn));
      }
      if (query.status) {
        result = result.filter(v => v.status.key === Number(query.status));
      }
      if (query.riskCheck) {
        result = result.filter(
          v => v.riskCheck.key === Number(query.riskCheck)
        );
      }
      const total = result.reduce((s, v) => s + v.amount, 0);
      const fee = result.length * 10;
      return {
        success: true,
        data: {
          list: result,
          count: result.length,
          total,
          fee,
          erctotal: Math.round(total * 0.6),
          trctotal: Math.round(total * 0.4)
        }
      };
    }
  },
  {
    // 提款提示音檢查
    url: "/backend/payment/beep",
    method: "post",
    response: () => ({
      success: true,
      data: { hasMemberWithdrawal: false }
    })
  },
  {
    // 匯出（佔位，回成功）
    url: "/backend/withdrawal/export",
    method: "get",
    response: () => ({ success: true, data: null })
  }
]);
