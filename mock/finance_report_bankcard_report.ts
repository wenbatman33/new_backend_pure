import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 科目假資料
const subjects = [
  { subjectID: 1, name: "存款" },
  { subjectID: 2, name: "取款" },
  { subjectID: 3, name: "手續費" },
  { subjectID: 4, name: "調帳" }
];

// 銀行卡下拉假資料
const bankcards = Array.from({ length: 6 }).map((_, i) => ({
  id: i + 1,
  card_no: `622848${String(10000000 + i)}`,
  account_name: `戶名${i + 1}`,
  status: i % 4 === 0 ? 2 : 1 // 部分停用
}));

// 明細列表假資料
const objects = ["王小明", "李大華", "張三", "陳五", "第三方支付"];
const allLogs = Array.from({ length: 16 }).map((_, i) => {
  const type = (i % 2) + 1; // 1 收 / 2 支
  const amount = 1000 * (i + 1);
  return {
    ID: i + 1,
    logTime: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 12:${String(
      i % 60
    ).padStart(2, "0")}:00`,
    bankcardID: (i % bankcards.length) + 1,
    subjectID: (i % subjects.length) + 1,
    type,
    amount,
    fee: i * 5,
    balance: 500000 - i * 1000,
    tradeID: 90000 + i,
    thirdParty: `TP${100000 + i}`,
    tradeObjectType: 1,
    tradeObject: objects[i % objects.length],
    note: i % 3 === 0 ? `備註內容 ${i + 1}` : "",
    updatedUser: i % 2 === 0 ? "admin" : "operator01",
    updatedAt: "2026-05-20 09:00:00"
  };
});

export default defineFakeRoute([
  {
    // 銀行卡明細：帳務明細
    url: "/backend/pay_bankcard/log",
    method: "get",
    response: ({ query }) => {
      let list = allLogs;
      if (query.subjects) {
        const ids = String(query.subjects)
          .split(",")
          .map(Number);
        list = list.filter(v => ids.includes(v.subjectID));
      }
      const countIn = list.filter(v => v.type === 1).length;
      const countOut = list.filter(v => v.type === 2).length;
      return {
        success: true,
        data: {
          list,
          count: list.length,
          countIn,
          countOut
        }
      };
    }
  },
  {
    // 銀行卡明細：增加/修改備註
    url: "/backend/pay_bankcard/note",
    method: "post",
    response: () => ({ success: true, data: { success: true } })
  },
  {
    // 銀行卡下拉清單
    url: "/backend/pay_bankcard/dropdown",
    method: "get",
    response: () => ({
      success: true,
      data: { bankcards }
    })
  },
  {
    // 共用下拉（含科目 subjects）
    url: "/backend/pay/pay_channel/dropdown",
    method: "get",
    response: () => ({
      success: true,
      data: { subjects }
    })
  }
]);
