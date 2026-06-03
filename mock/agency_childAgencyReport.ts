import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 下级代理报表假资料
function rand(min: number, max: number, dec = 0) {
  const v = Math.random() * (max - min) + min;
  return dec ? Number(v.toFixed(dec)) : Math.floor(v);
}

const all = Array.from({ length: 16 }).map((_, i) => {
  const recharge = rand(10000, 500000, 2);
  const withdraw = rand(5000, 300000, 2);
  const bet = rand(50000, 2000000, 2);
  const win = rand(40000, 1900000, 2);
  const netProfit = Number((recharge - withdraw).toFixed(2));
  const totalCommission = rand(-5000, 30000, 2);
  return {
    agencyID: 10000 + i,
    agencyAccount: `agency${String(i + 1).padStart(3, "0")}`,
    agencyName: `下级代理${i + 1}`,
    rechargeAmount: recharge,
    withdrawAmount: withdraw,
    betAmount: bet,
    totalWinAmount: win,
    netProfit,
    commissionPercent: `${rand(1, 15)}%`,
    totalCommission,
    totalCommissionPaid: rand(0, 20000, 2),
    regMemberCount: rand(5, 500),
    firstDepositCount: rand(1, 200),
    platformCharge: rand(100, 5000, 2),
    totalBonus: rand(500, 30000, 2),
    totalCharge: rand(100, 8000, 2),
    activeMemberCount: rand(1, 300),
    lastLoginTime: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 14:25:00`,
    isActive: (i % 2) + 1
  };
});

// 合计列（subTotal）
function buildSubTotal(list: typeof all) {
  const sum = (key: keyof (typeof all)[0]) =>
    Number(list.reduce((acc, cur) => acc + Number(cur[key] || 0), 0).toFixed(2));
  return [
    {
      rechargeAmount: sum("rechargeAmount"),
      withdrawAmount: sum("withdrawAmount"),
      betAmount: sum("betAmount"),
      totalWinAmount: sum("totalWinAmount"),
      netProfit: sum("netProfit"),
      totalCommission: sum("totalCommission"),
      totalCommissionPaid: sum("totalCommissionPaid"),
      regMemberCount: sum("regMemberCount"),
      firstDepositCount: sum("firstDepositCount"),
      platformCharge: sum("platformCharge"),
      totalBonus: sum("totalBonus"),
      totalCharge: sum("totalCharge"),
      activeMemberCount: sum("activeMemberCount")
    }
  ];
}

export default defineFakeRoute([
  {
    url: "/backend/report/childagency/list",
    method: "get",
    response: ({ query }) => {
      let list = all;
      if (query.agencyID) {
        list = list.filter(v => String(v.agencyID).includes(query.agencyID));
      }
      if (query.agencyAccount) {
        list = list.filter(v => v.agencyAccount.includes(query.agencyAccount));
      }
      if (query.memberType) {
        // 假资料仅按 isActive 模拟过滤
        list = list.filter(v => v.isActive === Number(query.memberType));
      }
      return {
        success: true,
        data: {
          list,
          total: list.length,
          subTotal: buildSubTotal(list)
        }
      };
    }
  }
]);
