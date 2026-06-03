import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 單一線路進款表假資料（依日期/時段拆 15 筆）
const list = Array.from({ length: 15 }).map((_, i) => ({
  id: i + 1,
  reportDate: `2026-05-${String((i % 28) + 1).padStart(2, "0")}`,
  reportHour: String(i % 24).padStart(2, "0"),
  serviceCode: ["ali", "wx", "usdt", "union", "sp", "gw"][i % 6],
  payChannelServiceID: (i % 3) + 1,
  payChannelServiceName: `线路${(i % 3) + 1}`,
  depositNum: 100 + i * 7,
  amount: 50000 + i * 3210,
  note: i % 4 === 0 ? "异常波动" : "",
  updatedAt: "2026-05-28 10:30:00",
  createdAt: "2026-05-01 00:00:00"
}));

const totalAmount = list.reduce((s, v) => s + v.amount, 0);
const totalDepositNum = list.reduce((s, v) => s + v.depositNum, 0);

export default defineFakeRoute([
  // 取得單一線路進款表
  {
    url: "/backend/report/channel/single_channel_deposit",
    method: "get",
    response: () => ({
      success: true,
      data: {
        list,
        count: list.length,
        totalDepositNum,
        totalAmount,
        updatedAt: "2026-05-28 10:30:00"
      }
    })
  },
  // 變更備註
  {
    url: "/backend/report/channel/single_channel_deposit_note",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  // 線路搜尋下拉
  {
    url: "/backend/pay/pay_channel/4report",
    method: "get",
    response: () => ({
      success: true,
      data: {
        list: [
          { id: 1, name: "线路1" },
          { id: 2, name: "线路2" },
          { id: 3, name: "线路3" }
        ]
      }
    })
  }
]);
