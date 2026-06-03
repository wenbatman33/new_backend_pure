import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 產生單筆對帳資料
function makeRow(i: number) {
  const deposit = 10000 + i * 1234.56;
  const payout = 5000 + i * 567.89;
  return {
    id: i + 1,
    payChannelSn: `SN${1000 + i}`,
    payChannelName: `商户通道${i + 1}`,
    serviceCode: ["ali", "wx", "usdt", "union", "sp", "gw"][i % 6],
    startingSystemBalance: 100000 + i * 888.88,
    depositAmount: deposit,
    payoutAmount: payout,
    payoutNum: 10 + i,
    settlementUAmount: 2000 + i * 321.0,
    settlementUNum: 3 + (i % 5),
    frozenAmount: 1500 + i * 100,
    endingSystemBalance: 100000 + deposit - payout,
    endingChannelBalance: 100000 + deposit - payout - (i % 3) * 50,
    endingBalanceDiff: (i % 3) * 50,
    note: i % 4 === 0 ? "已核对" : ""
  };
}

// 產生單一時段表（list 包裝）
function makeShift(count: number, offset = 0) {
  return {
    list: Array.from({ length: count }).map((_, i) => makeRow(i + offset))
  };
}

export default defineFakeRoute([
  {
    // 時段對帳列表：回傳以時段名稱為 key 的物件
    url: "/backend/report/channel/hour_reconciliation",
    method: "get",
    response: () => {
      return {
        success: true,
        data: {
          list: {
            "00:00 - 07:59": makeShift(12, 0),
            "08:00 - 15:59": makeShift(10, 12),
            "16:00 - 23:59": makeShift(8, 22)
          }
        }
      };
    }
  },
  {
    // 變更備註
    url: "/backend/report/channel/hour_reconciliation",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  {
    // 支付通道下拉（4report）
    url: "/backend/pay/pay_channel/4report",
    method: "get",
    response: () => {
      const list = Array.from({ length: 8 }).map((_, i) => ({
        id: `SN${1000 + i}`,
        name: `商户通道${i + 1}`
      }));
      return { success: true, data: { list } };
    }
  }
]);
