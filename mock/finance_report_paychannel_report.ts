import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 科目清單（subjectID -> name）
const subjects = [
  { subjectID: 1, name: "存款" },
  { subjectID: 2, name: "提款" },
  { subjectID: 3, name: "手续费" },
  { subjectID: 4, name: "调整" }
];

// 線路清單（代收）
const payChannelService = [
  { key: "alipay", value: "支付宝", status: 1 },
  { key: "wechat", value: "微信", status: 1 },
  { key: "unionpay", value: "银联（已停用）", status: 0 }
];

// 商戶號清單
const payChannels = [
  { id: 101, name: "商户A", status: 1 },
  { id: 102, name: "商户B", status: 1 },
  { id: 103, name: "商户C（已停用）", status: 0 }
];

const targetNames = ["王小明", "李大華", "陈先生", "测试商户"];

// 帳務明細假資料
const logs = Array.from({ length: 16 }).map((_, i) => {
  const incoming = (i % 2) * (1000 + i * 37);
  const outgoing = ((i + 1) % 2) * (800 + i * 23);
  return {
    id: i + 1,
    createdAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 09:${String(
      (i * 3) % 60
    ).padStart(2, "0")}:00`,
    subjectID: (i % subjects.length) + 1,
    in: incoming,
    out: outgoing,
    fee: Number(((incoming + outgoing) * 0.006).toFixed(2)),
    remainBalance: 500000 - i * 1234,
    frozenBalance: 10000 + i * 100,
    relationID: `R${20260500 + i}`,
    thirdID: `TP${900000 + i}`,
    targetName: targetNames[i % targetNames.length],
    editorName: i % 3 === 0 ? "admin" : "operator01",
    note: i % 4 === 0 ? "系统自动记录" : ""
  };
});

export default defineFakeRoute([
  // 帳務明細列表 + 合計
  {
    url: "/backend/pay/pay_channel/log",
    method: "get",
    response: ({ query }) => {
      let list = logs;
      if (query.payChannelID) {
        // 模擬以商戶號過濾（此處不真的綁定，回全部）
        list = logs;
      }
      const sum = list.reduce(
        (acc, cur) => {
          acc.in += cur.in;
          acc.out += cur.out;
          acc.fee += cur.fee;
          return acc;
        },
        { in: 0, out: 0, fee: 0 }
      );
      return {
        success: true,
        data: {
          list,
          total: list.length,
          in: sum.in,
          out: sum.out,
          fee: Number(sum.fee.toFixed(2))
        }
      };
    }
  },
  // 修改備註
  {
    url: "/backend/pay/pay_channel/log/note",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  // 科目 + 線路下拉
  {
    url: "/backend/pay/pay_channel/dropdown",
    method: "get",
    response: () => ({
      success: true,
      data: { subjects, payChannelService }
    })
  },
  // 商戶號報表下拉
  {
    url: "/backend/pay/pay_channel/4report",
    method: "get",
    response: () => ({
      success: true,
      data: { list: payChannels, total: payChannels.length }
    })
  }
]);
