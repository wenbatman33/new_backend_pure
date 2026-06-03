import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 代理报表假资料：15 笔
const groupNames = ["A组", "B组", "C组"];
const all = Array.from({ length: 15 }).map((_, i) => {
  const businessType = String(i % 3); // 0 全部 / 1 佣金制 / 2 占成制
  return {
    agencyID: 10000 + i,
    agencyAccount: `agency${i + 1}`,
    businessType,
    parentAgencyAccount: i % 4 === 0 ? "" : `parent${(i % 3) + 1}`,
    agencyChildCnt: i % 5, // 部分有下级（可点击下钻）
    rankSettingOfferPercent: `${(i % 10) * 5}%`,
    billingCycle: String((i % 2) + 1), // 1 月 / 2 周
    rankSettingGroupName: groupNames[i % groupNames.length],
    rechargeAmount: 100000 + i * 1234,
    withdrawAmount: 50000 + i * 567,
    betAmount: 800000 + i * 4321,
    totalWinAmount: 12000 + i * 321,
    depositWithdrawDiff: 50000 + i * 667,
    regMemberCount: 30 + i,
    rechargeMemberCount: 20 + i,
    withdrawMemberCount: 10 + i,
    betMemberCount: 25 + i,
    firstDepositCount: 5 + i,
    firstDepositAmount: 8000 + i * 100,
    continueDepositCount: 12 + i,
    continueDepositAmount: 30000 + i * 200,
    transferMemberCount: 3 + i,
    transferMemberAmount: 2000 + i * 80
  };
});

// 合计行
const totalRow = {
  agencyAccount: "",
  rechargeAmount: all.reduce((s, v) => s + v.rechargeAmount, 0),
  withdrawAmount: all.reduce((s, v) => s + v.withdrawAmount, 0),
  betAmount: all.reduce((s, v) => s + v.betAmount, 0),
  totalWinAmount: all.reduce((s, v) => s + v.totalWinAmount, 0),
  depositWithdrawDiff: all.reduce((s, v) => s + v.depositWithdrawDiff, 0),
  regMemberCount: all.reduce((s, v) => s + v.regMemberCount, 0),
  rechargeMemberCount: all.reduce((s, v) => s + v.rechargeMemberCount, 0),
  withdrawMemberCount: all.reduce((s, v) => s + v.withdrawMemberCount, 0),
  betMemberCount: all.reduce((s, v) => s + v.betMemberCount, 0),
  firstDepositCount: all.reduce((s, v) => s + v.firstDepositCount, 0),
  firstDepositAmount: all.reduce((s, v) => s + v.firstDepositAmount, 0),
  continueDepositCount: all.reduce((s, v) => s + v.continueDepositCount, 0),
  continueDepositAmount: all.reduce((s, v) => s + v.continueDepositAmount, 0),
  transferMemberCount: all.reduce((s, v) => s + v.transferMemberCount, 0),
  transferMemberAmount: all.reduce((s, v) => s + v.transferMemberAmount, 0)
};

export default defineFakeRoute([
  {
    url: "/backend/report/agencyph/report",
    method: "get",
    response: ({ query }) => {
      let list = all;
      if (query.agencyAccount) {
        list = list.filter(v => v.agencyAccount.includes(query.agencyAccount));
      }
      if (query.businessType && query.businessType !== "0") {
        list = list.filter(v => v.businessType === String(query.businessType));
      }
      // 模拟下钻：带 parentAgencyAccount 时回传面包屑
      const parentAgencyData = query.parentAgencyAccount
        ? [{ parentAgencyAccount: String(query.parentAgencyAccount) }]
        : [];
      if (query.parentAgencyAccount) {
        list = list.filter(
          v => v.parentAgencyAccount === String(query.parentAgencyAccount)
        );
      }
      return {
        success: true,
        data: {
          list,
          count: list.length,
          total: [totalRow],
          parentAgencyData
        }
      };
    }
  },
  {
    url: "/backend/report/agencyph/export",
    method: "get",
    response: () => ({ success: true, data: { list: all } })
  }
]);
