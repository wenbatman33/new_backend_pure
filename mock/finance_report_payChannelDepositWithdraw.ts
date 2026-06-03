import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 商戶號存提報表假資料：依商戶號/支付方式各一列
const serviceCodes = ["alipay", "wechat", "unionpay", "usdt", "bank"];
const reportList = Array.from({ length: 14 }).map((_, i) => {
  const depositAmount = 100000 + i * 3571;
  const depositNum = 200 + i * 13;
  const successDepositNum = depositNum - (i % 7);
  const withdrawalAmount = 50000 + i * 1987;
  const withdrawalNum = 80 + i * 5;
  const successWithdrawalNum = withdrawalNum - (i % 4);
  return {
    reportDate: `2026-05-${String((i % 28) + 1).padStart(2, "0")}`,
    serviceCode: serviceCodes[i % serviceCodes.length],
    payChannelSn: `PC${10000 + i}`,
    depositAmount,
    depositOtherAmount: Math.round(depositAmount * 0.12),
    depositNum,
    successDepositNum,
    successDepositRate: Number(
      ((successDepositNum / depositNum) * 100).toFixed(2)
    ),
    withdrawalAmount,
    withdrawalOtherAmount: Math.round(withdrawalAmount * 0.08),
    withdrawalNum,
    successWithdrawalNum,
    successWithdrawalRate: Number(
      ((successWithdrawalNum / withdrawalNum) * 100).toFixed(2)
    )
  };
});

// 彙總總計
const sum = (key: string) =>
  reportList.reduce((acc, cur: any) => acc + Number(cur[key] || 0), 0);

export default defineFakeRoute([
  // 商戶號存提報表
  {
    url: "/backend/report/channel/deposit_withdraw",
    method: "get",
    response: () => {
      const depositTotalNum = sum("depositNum");
      const successDepositTotalNum = sum("successDepositNum");
      const withdrawalTotalNum = sum("withdrawalNum");
      const successWithdrawalTotalNum = sum("successWithdrawalNum");
      return {
        success: true,
        data: {
          list: reportList,
          total: reportList.length,
          updatedAt: "2026-06-03 08:30:00",
          depositTotalAmount: sum("depositAmount"),
          depositOtherTotalAmount: sum("depositOtherAmount"),
          depositTotalNum,
          successDepositTotalNum,
          successDepositTotalRate: Number(
            ((successDepositTotalNum / depositTotalNum) * 100).toFixed(2)
          ),
          withdrawalTotalAmount: sum("withdrawalAmount"),
          withdrawalOtherTotalAmount: sum("withdrawalOtherAmount"),
          withdrawalTotalNum,
          successWithdrawalTotalNum,
          successWithdrawalTotalRate: Number(
            ((successWithdrawalTotalNum / withdrawalTotalNum) * 100).toFixed(2)
          )
        }
      };
    }
  },
  // 商戶號搜尋選單
  {
    url: "/backend/pay/pay_channel/4report",
    method: "get",
    response: () => ({
      success: true,
      data: {
        list: Array.from({ length: 8 }).map((_, i) => ({
          id: i + 1,
          name: `${serviceCodes[i % serviceCodes.length]}-PC${10000 + i}`,
          status: i % 5 === 0 ? 0 : 1
        }))
      }
    })
  },
  // 用戶（金流）組別選單
  {
    url: "/backend/pay_group/groups",
    method: "get",
    response: () => ({
      success: true,
      data: {
        list: Array.from({ length: 6 }).map((_, i) => ({
          ID: i + 1,
          name: `用户组别${i + 1}`
        }))
      }
    })
  }
]);
