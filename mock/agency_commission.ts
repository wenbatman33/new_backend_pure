import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 產生一筆佣金假資料
function genRow(i: number, tab: number) {
  const status = [1, 2, 3, 4][i % 4];
  const delivered = status >= 2 && i % 3 === 0 ? "2026-05-10 12:00:00" : "";
  return {
    id: 1000 + i,
    date: "2026-05-01 00:00:00",
    deliveredAt: tab === 2 ? "" : delivered,
    childDeliveredAt: tab === 2 ? delivered : "",
    agencyID: 5000 + i,
    agencyName: `代理名稱${i}`,
    agencyAccount: `agency_${i}`,
    parentAgencyId: i % 2 === 0 ? 0 : 4000 + i,
    wallet: (1000 + i * 37.5).toFixed(2),
    commissionPercent: 10 + (i % 5),
    activeMemberCount: 20 + i,
    firstDepositCount: 5 + i,
    totalWinAmount: (5000 + i * 120).toFixed(2),
    childTotalWinAmount: (3000 + i * 80).toFixed(2),
    rechargeAmount: (8000 + i * 200).toFixed(2),
    withdrawAmount: (4000 + i * 90).toFixed(2),
    betAmount: (20000 + i * 500).toFixed(2),
    platformCharge: (300 + i * 12).toFixed(2),
    totalBonus: (150 + i * 8).toFixed(2),
    totalCharge: (200 + i * 9).toFixed(2),
    netProfit: (i % 4 === 0 ? -1 : 1) * (500 + i * 15),
    totalCommission: i % 6 === 0 ? 0 : 600 + i * 25,
    lastTotalCommission: (i % 3 === 0 ? -1 : 1) * (400 + i * 10),
    childCommissionAmount: 200 + i * 11,
    childBonusAmount: 80 + i * 4,
    percentOfSameDevice: `${(i % 30)}%`,
    billingCycle: tab === 3 ? (i % 2 === 0 ? 1 : 2) : 1,
    status,
    childStatus: status
  };
}

function genList(tab: number) {
  const list = [];
  for (let i = 1; i <= 15; i++) list.push(genRow(i, tab));
  return list;
}

export default defineFakeRoute([
  {
    url: "/backend/agency/commission/list",
    method: "get",
    response: () => ({
      success: true,
      data: { list: genList(1), total: 15 }
    })
  },
  {
    url: "/backend/agency/commission/childlist",
    method: "get",
    response: () => ({
      success: true,
      data: { list: genList(2), total: 15 }
    })
  },
  {
    url: "/backend/agency/commission/listoffer",
    method: "get",
    response: () => ({
      success: true,
      data: { list: genList(3), total: 15 }
    })
  },
  {
    url: "/backend/agency/commission/getdistributedcalc",
    method: "get",
    response: () => ({
      success: true,
      data: { cnt: 6, amount: 12345.67 }
    })
  },
  {
    url: "/backend/agency/commission/getchilddistributedcalc",
    method: "get",
    response: () => ({
      success: true,
      data: { cnt: 4, childCommissionAmount: 8888.88, childBonusAmount: 1234.56 }
    })
  },
  {
    url: "/backend/agency/commission/review",
    method: "put",
    response: () => ({ success: true, data: {} })
  },
  {
    url: "/backend/agency/commission/childreview",
    method: "put",
    response: () => ({ success: true, data: {} })
  },
  {
    url: "/backend/agency/commission/reviewOffer",
    method: "put",
    response: () => ({ success: true, data: {} })
  }
]);
