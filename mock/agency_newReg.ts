import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 代理新註冊報表主列表假資料（10~20 筆）
const reportList = Array.from({ length: 14 }).map((_, i) => {
  const win = i % 4 === 0 ? -(1000 * (i + 1)) : 1000 * (i + 1);
  const profit = i % 5 === 0 ? -(500 * (i + 1)) : 500 * (i + 1);
  return {
    agencyID: 10000 + i,
    agencyAccount: `agency${i + 1}`,
    regMemberCount: 20 + i * 3,
    firstDepositCount: 5 + i,
    transferMember: 1000 * (i + 1),
    rechargeAmount: 50000 + i * 1200,
    withdrawAmount: 30000 + i * 800,
    distContinueDepositCount: 3 + i,
    distWithdrawCount: 2 + i,
    betAmount: 200000 + i * 5000,
    platformCharge: 1500 + i * 30,
    totalBonus: 800 + i * 20,
    totalCharge: 1200 + i * 25,
    totalWinAmount: win,
    netProfit: profit,
    playerCount: 15 + i,
    activeMemberCount: 10 + i
  };
});

// 合計列
const subTotalRow = {
  regMemberCount: reportList.reduce((s, v) => s + v.regMemberCount, 0),
  firstDepositCount: reportList.reduce((s, v) => s + v.firstDepositCount, 0),
  transferMember: reportList.reduce((s, v) => s + v.transferMember, 0),
  rechargeAmount: reportList.reduce((s, v) => s + v.rechargeAmount, 0),
  withdrawAmount: reportList.reduce((s, v) => s + v.withdrawAmount, 0),
  distContinueDepositCount: reportList.reduce(
    (s, v) => s + v.distContinueDepositCount,
    0
  ),
  distWithdrawCount: reportList.reduce((s, v) => s + v.distWithdrawCount, 0),
  betAmount: reportList.reduce((s, v) => s + v.betAmount, 0),
  platformCharge: reportList.reduce((s, v) => s + v.platformCharge, 0),
  totalBonus: reportList.reduce((s, v) => s + v.totalBonus, 0),
  totalCharge: reportList.reduce((s, v) => s + v.totalCharge, 0),
  totalWinAmount: reportList.reduce((s, v) => s + v.totalWinAmount, 0),
  netProfit: reportList.reduce((s, v) => s + v.netProfit, 0),
  playerCount: reportList.reduce((s, v) => s + v.playerCount, 0),
  activeMemberCount: reportList.reduce((s, v) => s + v.activeMemberCount, 0)
};

// 明細列表假資料（註冊 / 首儲 / 活躍共用結構）
function buildDetail(count: number) {
  return Array.from({ length: count }).map((_, i) => ({
    id: 500000 + i,
    account: `m_${i + 1}`,
    name: `會员${i + 1}`,
    phone: `09${String(10000000 + i).slice(0, 8)}`,
    current_status: i % 2 === 0,
    deposit_limit: (i % 2) + 1,
    withdraw_limit: (i % 2) + 1,
    recharge_count: 2 + i,
    recharge_amount: 3000 + i * 150,
    withdraw_amount: 1500 + i * 100,
    promotion_times: i % 3,
    status: (i % 3) + 1,
    use_same_device_id: (i % 2) + 1,
    created_at: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 09:15:00`,
    last_login_at: `2026-06-${String((i % 28) + 1).padStart(2, "0")} 18:40:00`,
    register_ip: `192.168.1.${i + 1}`,
    register_area: "中国",
    last_login_ip: `10.0.0.${i + 1}`,
    last_login_area: "中国",
    agency_id: 10000 + (i % 5),
    payment_groups: `pg_${(i % 3) + 1}`,
    bankcard_groups: `bg_${(i % 3) + 1}`,
    tags: []
  }));
}

export default defineFakeRoute([
  {
    url: "/backend/report/agencynewregmember/list",
    method: "get",
    response: ({ query }) => {
      let list = reportList;
      if (query.agencyID) {
        list = list.filter(v => String(v.agencyID).includes(query.agencyID));
      }
      if (query.agencyAccount) {
        list = list.filter(v => v.agencyAccount.includes(query.agencyAccount));
      }
      return {
        success: true,
        data: { list, total: list.length, subTotal: [subTotalRow] }
      };
    }
  },
  {
    url: "/backend/report/agencynewregmember/newreglist",
    method: "get",
    response: () => ({
      success: true,
      data: { list: buildDetail(12), total: 12 }
    })
  },
  {
    url: "/backend/report/agencynewregmember/newregfirstdepositlist",
    method: "get",
    response: () => ({
      success: true,
      data: { list: buildDetail(8), total: 8 }
    })
  },
  {
    url: "/backend/report/agencynewregmember/newregactivememberlist",
    method: "get",
    response: () => ({
      success: true,
      data: { list: buildDetail(10), total: 10 }
    })
  }
]);
