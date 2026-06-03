import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 產生連續日期 2026-05-xx
function genDates(n: number) {
  const arr: string[] = [];
  for (let i = 0; i < n; i++) {
    arr.push(`2026-05-${String(i + 1).padStart(2, "0")}`);
  }
  return arr;
}

const rnd = (min: number, max: number) =>
  Math.round((Math.random() * (max - min) + min) * 100) / 100;

// 人數提款報表假資料
function buildPeopleResult() {
  const dates = genDates(15);
  let totalWithdrawNum = 0;
  let totalAmount = 0;
  let totalFee = 0;
  let totalActualAmount = 0;
  const list = dates.map(reportDate => {
    const uniquePeople = Math.floor(rnd(30, 200));
    const withdrawNum = uniquePeople + Math.floor(rnd(0, 80));
    const amount = rnd(30000, 400000);
    const fee = rnd(300, 4000);
    const actualAmount = amount - fee;
    totalWithdrawNum += withdrawNum;
    totalAmount += amount;
    totalFee += fee;
    totalActualAmount += actualAmount;
    return {
      reportDate,
      uniquePeople,
      firstPeople: Math.floor(rnd(3, 40)),
      withdrawNum,
      amount,
      avgAmount: Math.round((amount / uniquePeople) * 100) / 100,
      fee,
      actualAmount,
      withdrawRate: rnd(0.1, 0.9)
    };
  });
  return {
    list,
    count: list.length,
    totalWithdrawNum,
    totalAmount: Math.round(totalAmount * 100) / 100,
    totalFee: Math.round(totalFee * 100) / 100,
    totalActualAmount: Math.round(totalActualAmount * 100) / 100,
    updatedAt: "2026-06-02 08:30:00"
  };
}

// 金額區間提款報表假資料
function buildAmountRangeResult() {
  const dates = genDates(15);
  const totals = {
    totalAmount100: 0,
    totalAmount500: 0,
    totalAmount1000: 0,
    totalAmount2000: 0,
    totalAmount6000: 0,
    totalAmount10000: 0,
    totalAmount20000: 0,
    totalAmountMore20000: 0
  };
  const list = dates.map(reportDate => {
    const row = {
      reportDate,
      amount100: Math.floor(rnd(5, 80)),
      amount500: Math.floor(rnd(5, 70)),
      amount1000: Math.floor(rnd(3, 60)),
      amount2000: Math.floor(rnd(3, 50)),
      amount6000: Math.floor(rnd(2, 40)),
      amount10000: Math.floor(rnd(1, 30)),
      amount20000: Math.floor(rnd(1, 20)),
      amountMore20000: Math.floor(rnd(0, 10))
    };
    totals.totalAmount100 += row.amount100;
    totals.totalAmount500 += row.amount500;
    totals.totalAmount1000 += row.amount1000;
    totals.totalAmount2000 += row.amount2000;
    totals.totalAmount6000 += row.amount6000;
    totals.totalAmount10000 += row.amount10000;
    totals.totalAmount20000 += row.amount20000;
    totals.totalAmountMore20000 += row.amountMore20000;
    return row;
  });
  return {
    list,
    count: list.length,
    ...totals,
    updatedAt: "2026-06-02 08:30:00"
  };
}

const peopleResponse = () => ({ success: true, data: buildPeopleResult() });
const amountRangeResponse = () => ({
  success: true,
  data: buildAmountRangeResult()
});
const okResponse = () => ({ success: true, data: null });

export default defineFakeRoute([
  // 人數報表（日/週/月）
  {
    url: "/backend/report/withdraw/people_report",
    method: "get",
    response: peopleResponse
  },
  {
    url: "/backend/report/withdraw/people_week_report",
    method: "get",
    response: peopleResponse
  },
  {
    url: "/backend/report/withdraw/people_month_report",
    method: "get",
    response: peopleResponse
  },
  // 金額區間報表（日/週/月）
  {
    url: "/backend/report/withdraw/amount_range_report",
    method: "get",
    response: amountRangeResponse
  },
  {
    url: "/backend/report/withdraw/amount_range_week_report",
    method: "get",
    response: amountRangeResponse
  },
  {
    url: "/backend/report/withdraw/amount_range_month_report",
    method: "get",
    response: amountRangeResponse
  },
  // 重算報表（POST，舊碼會先打但結果不使用）
  {
    url: "/backend/report/withdraw/amount_range_report",
    method: "post",
    response: okResponse
  },
  {
    url: "/backend/report/withdraw/amount_range_week_report",
    method: "post",
    response: okResponse
  },
  {
    url: "/backend/report/withdraw/amount_range_month_report",
    method: "post",
    response: okResponse
  }
]);
