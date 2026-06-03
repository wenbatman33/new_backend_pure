import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 日對帳報表假資料
const serviceNames = ["支付宝", "微信", "USDT", "银联", "快捷"];
const serviceCodes = ["ali", "wx", "usdt", "union", "sp"];

const rand = (min: number, max: number) =>
  Math.round((Math.random() * (max - min) + min) * 100) / 100;

const list = Array.from({ length: 15 }).map((_, i) => {
  const startingSystemBalance = rand(10000, 50000);
  const depositAmount = rand(1000, 20000);
  const payoutAmount = rand(500, 15000);
  const settlementUAmount = rand(0, 8000);
  const frozenAmount = rand(0, 3000);
  const endingSystemBalance =
    startingSystemBalance + depositAmount - payoutAmount;
  // 部分資料製造差異
  const endingChannelBalance =
    i % 4 === 0 ? endingSystemBalance - rand(1, 500) : endingSystemBalance;
  const endingBalanceDiff =
    Math.round((endingSystemBalance - endingChannelBalance) * 100) / 100;
  return {
    id: i + 1,
    payChannelSn: `CH${10000 + i}`,
    payChannelName: `商户线路${i + 1}`,
    serviceName: serviceNames[i % serviceNames.length],
    serviceCode: serviceCodes[i % serviceCodes.length],
    startingSystemBalance,
    depositAmount,
    payoutAmount,
    payoutNum: Math.floor(Math.random() * 50),
    settlementUAmount,
    settlementUNum: Math.floor(Math.random() * 30),
    frozenAmount,
    endingSystemBalance,
    endingChannelBalance,
    endingBalanceDiff,
    note: i % 5 === 0 ? "已核对" : ""
  };
});

const sum = (key: string) =>
  Math.round(list.reduce((p, n) => p + (n as any)[key], 0) * 100) / 100;

export default defineFakeRoute([
  // 取得日對帳列表（含合計 total* 欄位）
  {
    url: "/backend/report/channel/day_reconciliation",
    method: "get",
    response: () => {
      return {
        success: true,
        data: {
          list,
          count: list.length,
          updatedAt: "2026-06-03 08:00:00",
          totalStartingSystemBalance: sum("startingSystemBalance"),
          totalDepositAmount: sum("depositAmount"),
          totalPayoutAmount: sum("payoutAmount"),
          totalPayoutNum: list.reduce((p, n) => p + n.payoutNum, 0),
          totalSettlementUAmount: sum("settlementUAmount"),
          totalSettlementNum: list.reduce((p, n) => p + n.settlementUNum, 0),
          totalFrozenAmount: sum("frozenAmount"),
          totalEndingSystemBalance: sum("endingSystemBalance"),
          totalEndingChannelBalance: sum("endingChannelBalance"),
          totalEndingBalanceDiff: sum("endingBalanceDiff")
        }
      };
    }
  },
  // 變更備註
  {
    url: "/backend/report/channel/day_reconciliation",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  // 商戶號下拉選項
  {
    url: "/backend/pay/pay_channel/4report",
    method: "get",
    response: () => ({
      success: true,
      data: {
        list: list.map(v => ({ id: v.payChannelSn, name: v.payChannelName }))
      }
    })
  }
]);
