import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 產生連續日期
function genDates(n: number) {
  const arr: string[] = [];
  for (let i = 0; i < n; i++) {
    const d = new Date(2026, 4, i + 1); // 2026-05-xx
    arr.push(
      `2026-05-${String(d.getDate()).padStart(2, "0")}`
    );
  }
  return arr;
}

const rnd = (min: number, max: number) =>
  Math.round((Math.random() * (max - min) + min) * 100) / 100;

// 人數報表假資料
function buildPeopleResult() {
  const dates = genDates(15);
  const list = dates.map(reportDate => {
    const uniquePeople = Math.floor(rnd(50, 300));
    const depositNum = uniquePeople + Math.floor(rnd(0, 100));
    const amount = rnd(50000, 500000);
    const fee = rnd(500, 5000);
    return {
      reportDate,
      serviceCode: "ali",
      uniquePeople,
      firstPeople: Math.floor(rnd(5, 50)),
      depositNum,
      amount,
      memberAmount: amount * 0.7,
      agencyAmount: amount * 0.3,
      avgAmount: amount / uniquePeople,
      fee,
      actualAmount: amount - fee,
      depositRate: rnd(0.3, 0.9)
    };
  });
  const sum = (k: string) =>
    list.reduce((a, b) => a + ((b as any)[k] || 0), 0);
  return {
    list,
    count: list.length,
    totalDepositNum: sum("depositNum"),
    totalAmount: sum("amount"),
    totalMemberAmount: sum("memberAmount"),
    totalAgencyAmount: sum("agencyAmount"),
    totalFee: sum("fee"),
    totalActualAmount: sum("actualAmount"),
    updatedAt: "2026-05-31 23:59:59"
  };
}

// 金額區間報表假資料
function buildAmountRangeResult() {
  const dates = genDates(15);
  const list = dates.map(reportDate => ({
    reportDate,
    serviceCode: "ali",
    amount100: Math.floor(rnd(10, 100)),
    amount500: Math.floor(rnd(10, 100)),
    amount1000: Math.floor(rnd(10, 100)),
    amount2000: Math.floor(rnd(10, 100)),
    amount6000: Math.floor(rnd(5, 50)),
    amount10000: Math.floor(rnd(5, 50)),
    amount20000: Math.floor(rnd(1, 20)),
    amountMore20000: Math.floor(rnd(1, 10))
  }));
  const sum = (k: string) =>
    list.reduce((a, b) => a + ((b as any)[k] || 0), 0);
  return {
    list,
    count: list.length,
    totalAmount100: sum("amount100"),
    totalAmount500: sum("amount500"),
    totalAmount1000: sum("amount1000"),
    totalAmount2000: sum("amount2000"),
    totalAmount6000: sum("amount6000"),
    totalAmount10000: sum("amount10000"),
    totalAmount20000: sum("amount20000"),
    totalAmountMore20000: sum("amountMore20000"),
    updatedAt: "2026-05-31 23:59:59"
  };
}

const peopleRoute = (url: string) => ({
  url,
  method: "get",
  response: () => ({ success: true, data: buildPeopleResult() })
});

const amountRoute = (url: string) => ({
  url,
  method: "get",
  response: () => ({ success: true, data: buildAmountRangeResult() })
});

export default defineFakeRoute([
  // 人數報表（日/週/月）
  peopleRoute("/backend/report/deposit/people_report"),
  peopleRoute("/backend/report/deposit/people_week_report"),
  peopleRoute("/backend/report/deposit/people_month_report"),
  // 金額區間報表（日/週/月）
  amountRoute("/backend/report/deposit/amount_range_report"),
  amountRoute("/backend/report/deposit/amount_range_week_report"),
  amountRoute("/backend/report/deposit/amount_range_month_report"),
  // 支付方式下拉
  {
    url: "/backend/pay_channel_service/dropdown",
    method: "get",
    response: () => ({
      success: true,
      data: {
        serviceCode: [
          { ali: "支付宝" },
          { wx: "微信" },
          { usdt: "USDT" },
          { union: "银联" },
          { sp: "快捷" },
          { gw: "网关" }
        ]
      }
    })
  }
]);
