import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 收支類型（useTypeID <= 1000 才會出現在搜尋下拉）
const useTypeList = [
  { useTypeID: 1, useTypeName: "存款", color: "#1677ff" },
  { useTypeID: 2, useTypeName: "提款", color: "#fa541c" },
  { useTypeID: 10, useTypeName: "下注", color: "#52c41a" },
  { useTypeID: 11, useTypeName: "派彩", color: "#13c2c2" },
  { useTypeID: 20, useTypeName: "VIP禮金", color: "#722ed1" },
  { useTypeID: 21, useTypeName: "VIP反水", color: "#eb2f96" }
];

// 假錢包紀錄
const notes = [
  "一般交易",
  "【手動存單】補單調整",
  "VIP_GIFT_MONTH/0",
  "VIP_RETURN_SLOT/3",
  "活動派彩"
];
const all = Array.from({ length: 16 }).map((_, i) => {
  const inOut = (i % 2) + 1;
  const amount = inOut === 1 ? 1000 + i * 50 : -(500 + i * 30);
  const before = 10000 + i * 100;
  return {
    id: i + 1,
    account: "member888",
    date: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 14:30:0${i % 10}`,
    inOut,
    type: useTypeList[i % useTypeList.length].useTypeID,
    before,
    amount,
    after: before + amount,
    turnoverMultiple: i % 3 === 0 ? "" : String(i % 5),
    turnoverLimit: i % 2 === 0 ? 2000 + i * 10 : -(1000 + i * 5),
    note: notes[i % notes.length],
    refID: `REF${20260500 + i}`
  };
});

export default defineFakeRoute([
  // 錢包紀錄列表
  {
    url: "/backend/member/walletlogs/withdrawallist",
    method: "get",
    response: ({ query }) => {
      let list = all;
      if (query.inOut) {
        list = list.filter(v => v.inOut === Number(query.inOut));
      }
      if (query.type) {
        const types = String(query.type)
          .split(",")
          .map(Number);
        list = list.filter(v => types.includes(v.type));
      }
      const totalAmount = list.reduce((sum, v) => sum + v.amount, 0);
      return {
        success: true,
        data: { list, total: list.length, totalAmount }
      };
    }
  },
  // 收支類型
  {
    url: "/backend/money/useType",
    method: "get",
    response: () => ({ success: true, data: { list: useTypeList } })
  }
]);
